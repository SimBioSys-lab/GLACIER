"""
VASCO HPC Service

Handles HPC integration for VASCO (Viral Antibody Structural Complex Analysis).
Uploads files to HPC and submits SLURM jobs for paratope prediction.
"""
import os
import time
import posixpath
import paramiko
from typing import Dict, Optional

from app.config import settings
from app.logging_config import setup_logging

logger = setup_logging()

# VASCO pipeline location on HPC
VASCO_PIPELINE = "/projects/SimBioSys/share/software/VASCO"


def _connect():
    """Establish SSH connection to HPC"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    pkey = None
    
    # Try to load SSH key if specified
    key_path = getattr(settings, "HPC_SSH_KEY", "") or ""
    
    if key_path and key_path.strip():
        key_path = os.path.expanduser(key_path)
        if os.name == "nt":
            key_path = os.path.normpath(key_path)
        
        if os.isfile(key_path):
            passphrase = getattr(settings, "HPC_SSH_PASSPHRASE", None)
            try:
                pkey = paramiko.Ed25519Key.from_private_key_file(key_path, password=passphrase)
            except paramiko.PasswordRequiredException:
                raise RuntimeError("Key is passphrase-protected: set HPC_SSH_PASSPHRASE")
            except paramiko.SSHException:
                try:
                    pkey = paramiko.RSAKey.from_private_key_file(key_path, password=passphrase)
                except Exception as e:
                    raise RuntimeError(f"Failed to load SSH key from {key_path}: {e}")

    # Connect
    ssh.connect(
        hostname=settings.HPC_HOST,
        port=settings.HPC_PORT,
        username=settings.HPC_USER,
        pkey=pkey,
        password=getattr(settings, "HPC_PASSWORD", None),
        look_for_keys=(pkey is None),
        allow_agent=(pkey is None),
        timeout=20,
    )
    sftp = ssh.open_sftp()
    return ssh, sftp


def submit_vasco_job(
    user_id: str,
    local_antibody_path: str,
    local_antigen_path: str,
    light_chain: str,
    heavy_chain: str,
    antigen_chains: str,
    email: str,
    name: str
) -> Dict[str, str]:
    """
    Upload files to HPC and submit VASCO prediction job.
    
    Args:
        user_id: Unique user identifier
        local_antibody_path: Path to local antibody PDB file
        local_antigen_path: Path to local antigen PDB file
        light_chain: Light chain ID (e.g., 'L')
        heavy_chain: Heavy chain ID (e.g., 'H')
        antigen_chains: Comma-separated antigen chain IDs
        email: User email for notifications
        name: User name
    
    Returns:
        Dict with job_id and slurm_job_id
    """
    
    logger.info(f"Submitting VASCO job for user {user_id}")
    
    try:
        ssh, sftp = _connect()
        logger.info("SSH connection established")
        
        # HPC paths
        hpc_input_dir = posixpath.join(VASCO_PIPELINE, "inputs", user_id)
        hpc_output_dir = posixpath.join(VASCO_PIPELINE, "outputs", user_id)
        
        # Create directories on HPC
        cmd = f"mkdir -p {hpc_input_dir} {hpc_output_dir}"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        exit_code = stdout.channel.recv_exit_status()
        
        if exit_code != 0:
            error = stderr.read().decode()
            raise RuntimeError(f"Failed to create HPC directories: {error}")
        
        logger.info(f"Created HPC directories: {hpc_input_dir}")
        
        # Upload antibody PDB
        hpc_antibody = posixpath.join(hpc_input_dir, "antibody.pdb")
        sftp.put(local_antibody_path, hpc_antibody)
        logger.info(f"Uploaded antibody.pdb to HPC")
        
        # Upload antigen PDB
        hpc_antigen = posixpath.join(hpc_input_dir, "antigen.pdb")
        sftp.put(local_antigen_path, hpc_antigen)
        logger.info(f"Uploaded antigen.pdb to HPC")
        
        # Save metadata on HPC
        metadata_content = f"""VASCO Analysis Metadata
User ID: {user_id}
Name: {name}
Email: {email}
Light Chain: {light_chain}
Heavy Chain: {heavy_chain}
Antigen Chains: {antigen_chains}
Submitted: {time.strftime("%Y-%m-%d %H:%M:%S")}
"""
        
        hpc_metadata = posixpath.join(hpc_input_dir, "metadata.txt")
        with sftp.open(hpc_metadata, 'w') as f:
            f.write(metadata_content)
        
        logger.info("Metadata saved to HPC")
        
        # Create SLURM job script with Azure URL capture
        slurm_content = f"""#!/bin/bash
#SBATCH -J vasco_{user_id[:8]}
#SBATCH -o {hpc_output_dir}/vasco_%j.out
#SBATCH -e {hpc_output_dir}/vasco_%j.err
#SBATCH --partition=gpu
#SBATCH --gres=gpu:v100-sxm2:1
#SBATCH -t 8:00:00
#SBATCH --cpus-per-task=10
#SBATCH --mail-user={email}
#SBATCH --mail-type=END,FAIL

# Log start
echo "=========================================="
echo "⚡ VASCO Analysis Started"
echo "User ID: {user_id}"
echo "User: {name}"
echo "Time: $(date)"
echo "=========================================="
echo ""

# Run VASCO pipeline (includes Azure folder creation and upload)
cd {VASCO_PIPELINE}
./pipeline.sh {user_id}

# Capture exit code
PIPELINE_EXIT=$?

# Log completion
echo ""
echo "=========================================="
if [ $PIPELINE_EXIT -eq 0 ]; then
    echo "✅ VASCO Analysis Completed Successfully"
    
    # Read Azure URL if available
    AZURE_URL_FILE="{hpc_output_dir}/azure_url.txt"
    if [ -f "$AZURE_URL_FILE" ]; then
        AZURE_URL=$(cat "$AZURE_URL_FILE")
        echo "📂 Azure Results: $AZURE_URL"
    fi
else
    echo "❌ VASCO Analysis Failed (exit code: $PIPELINE_EXIT)"
fi
echo "Time: $(date)"
echo "=========================================="

exit $PIPELINE_EXIT
"""
        
        # Upload SLURM script to tmp
        slurm_path = f"/tmp/vasco_{user_id}.slurm"
        with sftp.open(slurm_path, 'w') as f:
            f.write(slurm_content)
        
        logger.info(f"Created SLURM script at {slurm_path}")
        
        # Submit SLURM job
        submit_cmd = f"sbatch {slurm_path}"
        stdin, stdout, stderr = ssh.exec_command(submit_cmd)
        output = stdout.read().decode()
        error = stderr.read().decode()
        exit_code = stdout.channel.recv_exit_status()
        
        if exit_code != 0:
            logger.error(f"SLURM submission failed: {error}")
            raise RuntimeError(f"SLURM submission failed: {error}")
        
        # Extract SLURM job ID from "Submitted batch job 12345"
        slurm_job_id = output.strip().split()[-1]
        logger.info(f"SLURM job submitted: {slurm_job_id}")
        
        # Cleanup temp SLURM script
        ssh.exec_command(f"rm {slurm_path}")
        
        # Wait for Azure folder URL to be created (give it a few seconds)
        import time as time_module
        time_module.sleep(3)
        
        # Read Azure folder URL if it exists
        azure_folder_url = None
        azure_url_file = posixpath.join(VASCO_PIPELINE, "outputs", user_id, "azure_url.txt")
        try:
            with sftp.open(azure_url_file, 'r') as f:
                azure_folder_url = f.read().decode().strip()
                logger.info(f"Retrieved Azure URL: {azure_folder_url}")
        except Exception as e:
            logger.warning(f"Could not read Azure URL file (may not be created yet): {e}")
            # Try alternative location
            try:
                alt_azure_file = posixpath.join(VASCO_PIPELINE, "logs", user_id, "azure_folder_url.txt")
                with sftp.open(alt_azure_file, 'r') as f:
                    azure_folder_url = f.read().decode().strip()
                    logger.info(f"Retrieved Azure URL from alternate location: {azure_folder_url}")
            except Exception as e2:
                logger.warning(f"Azure URL not available yet: {e2}")
        
        # Close connections
        sftp.close()
        ssh.close()
        
        return {
            "job_id": user_id,
            "slurm_job_id": slurm_job_id,
            "status": "submitted",
            "azure_folder_url": azure_folder_url
        }
        
    except paramiko.SSHException as e:
        logger.error(f"SSH connection failed: {e}")
        raise RuntimeError(f"Failed to connect to HPC: {str(e)}")
    except Exception as e:
        logger.exception(f"VASCO job submission failed: {e}")
        raise RuntimeError(f"Failed to submit VASCO job: {str(e)}")


def check_vasco_status(user_id: str) -> Dict[str, str]:
    """
    Check the status of a VASCO job by reading HPC output files.
    
    Args:
        user_id: User identifier
    
    Returns:
        Dict with status information
    """
    try:
        ssh, sftp = _connect()
        
        output_dir = posixpath.join(VASCO_PIPELINE, "outputs", user_id)
        
        # Check if predictions.csv exists (job completed)
        try:
            predictions_path = posixpath.join(output_dir, "predictions.csv")
            sftp.stat(predictions_path)
            
            sftp.close()
            ssh.close()
            
            return {
                "status": "completed",
                "message": "Analysis complete",
                "user_id": user_id
            }
        except FileNotFoundError:
            # Check for SLURM output files
            try:
                # List files in output directory
                cmd = f"ls {output_dir}/*.out 2>/dev/null | head -1"
                stdin, stdout, stderr = ssh.exec_command(cmd)
                out_file = stdout.read().decode().strip()
                
                if out_file:
                    # Read last few lines to check progress
                    cmd = f"tail -20 {out_file}"
                    stdin, stdout, stderr = ssh.exec_command(cmd)
                    output = stdout.read().decode()
                    
                    # Parse current step from output
                    current_step = "Processing"
                    if "Step 1/8" in output or "Extract chains" in output:
                        current_step = "Step 1/8: Extracting chains"
                    elif "Step 2/8" in output or "adjacency" in output:
                        current_step = "Step 2/8: Building graph"
                    elif "Step 3/8" in output or "HHblits" in output:
                        current_step = "Step 3/8: Generating MSA (slowest)"
                    elif "Step 4/8" in output or "Downsample" in output:
                        current_step = "Step 4/8: Downsampling MSA"
                    elif "Step 5/8" in output or "ESM" in output:
                        current_step = "Step 5/8: ESM tokenization"
                    elif "Step 6/8" in output or "edge" in output:
                        current_step = "Step 6/8: Processing edges"
                    elif "Step 7/8" in output or "prediction" in output:
                        current_step = "Step 7/8: Running prediction"
                    elif "Step 8/8" in output or "visualization" in output:
                        current_step = "Step 8/8: Generating visualization"
                    
                    sftp.close()
                    ssh.close()
                    
                    return {
                        "status": "running",
                        "current_step": current_step,
                        "message": "Analysis in progress",
                        "user_id": user_id
                    }
                else:
                    sftp.close()
                    ssh.close()
                    
                    return {
                        "status": "queued",
                        "message": "Job queued, waiting to start",
                        "user_id": user_id
                    }
                    
            except Exception as e:
                logger.warning(f"Could not read status for {user_id}: {e}")
                sftp.close()
                ssh.close()
                
                return {
                    "status": "unknown",
                    "message": "Unable to determine status",
                    "user_id": user_id
                }
                
    except Exception as e:
        logger.error(f"Status check failed for {user_id}: {e}")
        return {
            "status": "error",
            "message": f"Failed to check status: {str(e)}",
            "user_id": user_id
        }
