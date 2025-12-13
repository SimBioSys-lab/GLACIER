"""
VASCO HPC Service - Updated to run pipeline directly on login node

Handles HPC integration for VASCO (Viral Antibody Structural Complex Analysis).
Uploads files to HPC and runs pipeline directly (not as SLURM batch job).
This allows email notifications to work since login node has internet access.
"""
import os
import time
import posixpath
import paramiko
from typing import Dict, Optional

from app.config import settings
from app.logging_config import setup_logging

logger = setup_logging()

# Import email function (will be used after job submission)
try:
    from app.services.emailer import send_vasco_email
    EMAIL_AVAILABLE = True
except ImportError:
    EMAIL_AVAILABLE = False
    logger.warning("Could not import send_vasco_email - email notifications will be disabled")

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
    Upload files to HPC and run VASCO pipeline directly on login node.
    
    IMPORTANT: Pipeline now runs directly on login node (not as SLURM batch job)
    because login node has internet access and can send email notifications.
    
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
        Dict with job_id, process_id, and azure_folder_url
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
        
        # Run pipeline directly on login node in background with nohup
        # This runs on login node which has internet access for emails
        logger.info(f"Running VASCO pipeline directly on login node for user {user_id}")
        
        run_cmd = f"""
cd {VASCO_PIPELINE} && \
nohup bash pipeline.sh {user_id} > {hpc_output_dir}/vasco_direct.out 2> {hpc_output_dir}/vasco_direct.err < /dev/null &
echo $!
"""
        
        stdin, stdout, stderr = ssh.exec_command(run_cmd, get_pty=False)
        stdin.close()
        stdout.channel.settimeout(5.0)  # Reduced timeout from 10s to 5s
        stderr.channel.settimeout(5.0)
        
        try:
            process_output = stdout.read().decode().strip()
            error_output = stderr.read().decode().strip()
        except Exception as e:
            logger.warning(f"Timeout reading command output: {e}")
            process_output = ""
            error_output = str(e)
        
        if error_output:
            logger.warning(f"Pipeline start stderr: {error_output}")
        
        # Extract process ID
        process_id = None
        if process_output and process_output.split()[-1].isdigit():
            process_id = process_output.split()[-1]
            logger.info(f"Pipeline started with PID: {process_id}")
        else:
            logger.warning(f"Could not extract PID from output: {process_output}")
            process_id = "unknown"
        
        # Give pipeline a moment to start (reduced from 5s to 2s)
        time.sleep(2)
        
        # Check if Azure URL was created
        azure_url_file = posixpath.join(hpc_output_dir, "azure_url.txt")
        azure_folder_url = None
        
        try:
            with sftp.open(azure_url_file, 'r') as f:
                azure_folder_url = f.read().decode().strip()
            logger.info(f"Read Azure URL from HPC: {azure_folder_url}")
        except FileNotFoundError:
            # Use default URL format
            azure_folder_url = f"https://glacierstorage01.blob.core.windows.net/glacier/{user_id}/index.html"
            logger.info(f"Using default Azure URL: {azure_folder_url}")
        
        # Close connections
        sftp.close()
        ssh.close()
        
        # Send "job started" email from backend (backend has internet)
        if EMAIL_AVAILABLE and email and email.strip():
            try:
                logger.info(f"Sending job started email to {email}")
                send_vasco_email(
                    action="started",
                    email=email,
                    name=name,
                    user_id=user_id,
                    job_id=process_id,
                    azure_url=azure_folder_url
                )
                logger.info(f"Job started email sent successfully to {email}")
            except Exception as e:
                logger.warning(f"Failed to send job started email: {e}")
                # Non-fatal - continue even if email fails
        else:
            logger.info("Email notifications disabled or no email provided")
        
        return {
            "job_id": user_id,
            "process_id": process_id,
            "status": "running",
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
            # Check for output files (either vasco_direct.out or vasco_*.out)
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
                    if "Step 1" in output or "Extract chains" in output or "Validating" in output:
                        current_step = "Step 1/8: Extracting chains"
                    elif "Step 2" in output or "adjacency" in output or "Combining" in output:
                        current_step = "Step 2/8: Building graph"
                    elif "Step 3" in output or "HHblits" in output or "MSA" in output:
                        current_step = "Step 3/8: Generating MSA (slowest, 2-4 hours)"
                    elif "Step 4" in output or "Downsample" in output:
                        current_step = "Step 4/8: Downsampling MSA"
                    elif "Step 5" in output or "ESM" in output or "embed" in output:
                        current_step = "Step 5/8: ESM embeddings"
                    elif "Step 6" in output or "edge" in output:
                        current_step = "Step 6/8: Processing edges"
                    elif "Step 7" in output or "prediction" in output or "neural" in output:
                        current_step = "Step 7/8: Running prediction"
                    elif "Step 8" in output or "visualization" in output or "heatmap" in output:
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
                        "status": "starting",
                        "message": "Job starting, waiting for output",
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
