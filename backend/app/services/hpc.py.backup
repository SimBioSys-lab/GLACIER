import os, posixpath, time, json
from typing import Optional, List, Tuple, Dict
import paramiko

from ..config import settings


def _connect():
    """Establish SSH connection to HPC"""
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    pkey = None
    
    # Only try to load SSH key if HPC_SSH_KEY is explicitly set
    key_path = getattr(settings, "HPC_SSH_KEY", "") or ""
    
    # Normalize and expand path only if key_path is not empty
    if key_path and key_path.strip():
        key_path = os.path.expanduser(key_path)
        if os.name == "nt":
            key_path = os.path.normpath(key_path)
        
        # Only try to load key if the file actually exists
        if os.path.isfile(key_path):
            passphrase = getattr(settings, "HPC_SSH_PASSPHRASE", None)
            try:
                pkey = paramiko.Ed25519Key.from_private_key_file(key_path, password=passphrase)
            except paramiko.PasswordRequiredException:
                raise RuntimeError("Key is passphrase-protected: set HPC_SSH_PASSPHRASE or use ssh-agent (ssh-add).")
            except paramiko.SSHException:
                try:
                    pkey = paramiko.RSAKey.from_private_key_file(key_path, password=passphrase)
                except Exception as e:
                    raise RuntimeError(f"Failed to load SSH key from {key_path}: {e}")

    # Connect with password or key
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


def _run_remote(ssh: paramiko.SSHClient, cmd: str, env: Optional[dict] = None) -> Tuple[int, str, str]:
    """Execute a command on remote HPC via SSH"""
    export = ""
    if env:
        export = " ".join([f"{k}='{v}'" for k, v in env.items()])
        export = f"export {export} && "
    
    stdin, stdout, stderr = ssh.exec_command(export + cmd)
    out = stdout.read().decode()
    err = stderr.read().decode()
    code = stdout.channel.recv_exit_status()
    return code, out, err


def _put_file(sftp: paramiko.SFTPClient, local: str, remote: str) -> None:
    """Upload a file via SFTP"""
    sftp.put(local, remote)


def setup_hpc_directories(ssh: paramiko.SSHClient, req_user_id: str) -> dict:
    """
    Navigate to GlycoShield and create directory structure:
    - inputs/
    - outputs/
    - logs/
    - inputs/{user_id}/
    
    Returns dict with paths
    """
    cmd = f"""
        set -e
        cd {settings.HPC_BASE_DIR} || {{ echo "Directory {settings.HPC_BASE_DIR} does not exist" >&2; exit 1; }}
        mkdir -p inputs outputs logs
        mkdir -p inputs/{req_user_id}
        pwd
    """.strip()
    
    code, out, err = _run_remote(ssh, cmd)
    if code != 0:
        raise RuntimeError(f"Failed to setup HPC directories: {err}")
    
    base_path = out.strip()
    
    return {
        "base_dir": base_path,
        "inputs_dir": posixpath.join(base_path, "inputs"),
        "outputs_dir": posixpath.join(base_path, "outputs"),
        "logs_dir": posixpath.join(base_path, "logs"),
        "user_inputs_dir": posixpath.join(base_path, "inputs", req_user_id)
    }


def upload_folder_to_hpc(
    ssh: paramiko.SSHClient,
    sftp: paramiko.SFTPClient,
    local_folder_path: str,
    hpc_folder_path: str,
    number_of_runs: int,
    gef_probe_radius: int
) -> List[str]:
    """
    Upload an entire folder from local to HPC, preserving all files.
    Creates input.dat and list file.
    
    Returns list of uploaded filenames.
    """
    folder_name = os.path.basename(local_folder_path)
    
    # Create HPC folder
    cmd = f'mkdir -p "{hpc_folder_path}"'
    code, out, err = _run_remote(ssh, cmd)
    if code != 0:
        raise RuntimeError(f"Failed to create HPC folder {folder_name}: {err}")
    
    print(f"DEBUG: Uploading folder {folder_name} to HPC...")
    
    # Get all files in local folder
    uploaded_files = []
    for filename in os.listdir(local_folder_path):
        local_file = os.path.join(local_folder_path, filename)
        
        # Skip directories and metadata files
        if os.path.isdir(local_file) or filename == 'user_info.txt':
            continue
        
        remote_file = posixpath.join(hpc_folder_path, filename)
        
        try:
            _put_file(sftp, local_file, remote_file)
            uploaded_files.append(filename)
            print(f"DEBUG:   Uploaded {filename}")
        except Exception as e:
            raise RuntimeError(f"Failed to upload {filename}: {e}")
    
    # Verify all files exist on HPC
    verify_cmd = f"ls -la {hpc_folder_path}"
    code, out, err = _run_remote(ssh, verify_cmd)
    print(f"DEBUG: Files in HPC {folder_name}:\n{out}")
    
    # Check for input.dat
    has_input_dat = "input.dat" in uploaded_files
    
    if has_input_dat:
        # Update existing input.dat
        update_cmd = f"""
            cd {hpc_folder_path}
            INPUT_DAT="input.dat"
            
            if grep -q '^NRUNS=' "$INPUT_DAT"; then
                sed -i 's/^NRUNS=.*/NRUNS={number_of_runs}/' "$INPUT_DAT"
            else
                echo 'NRUNS={number_of_runs}' >> "$INPUT_DAT"
            fi
            
            if grep -q '^GEF_PROBE_RADIUS=' "$INPUT_DAT"; then
                sed -i 's/^GEF_PROBE_RADIUS=.*/GEF_PROBE_RADIUS={gef_probe_radius}/' "$INPUT_DAT"
            else
                echo 'GEF_PROBE_RADIUS={gef_probe_radius}' >> "$INPUT_DAT"
            fi
        """.strip()
        
        code, out, err = _run_remote(ssh, update_cmd)
        if code != 0:
            raise RuntimeError(f"Failed to update input.dat: {err}")
    else:
        # Create new input.dat
        input_dat_path = posixpath.join(hpc_folder_path, "input.dat")
        create_cmd = f"""
            cat > {input_dat_path} <<'EOF'
NRUNS={number_of_runs}
GEF_PROBE_RADIUS={gef_probe_radius}
DEVIATION=4.0
COARSE=false
SAMPLING=simulation
TEMPERATURE=300.0
EOF
        """.strip()
        
        code, out, err = _run_remote(ssh, create_cmd)
        if code != 0:
            raise RuntimeError(f"Failed to create input.dat: {err}")
    
    # Create list file with PDB filenames
    pdb_files = [f for f in uploaded_files if f.lower().endswith('.pdb')]
    
    if pdb_files:
        list_path = posixpath.join(hpc_folder_path, "list")
        list_content = "\n".join(pdb_files)
        
        with sftp.file(list_path, "w") as f:
            f.write(list_content)
        
        print(f"DEBUG: Created list file with: {list_content}")
    
    return uploaded_files


def call_pipeline_script(
    ssh: paramiko.SSHClient,
    user_inputs_dir: str,
    req_user_id: str,
    email: str,
    name: str
) -> dict:
    """
    Call pipeline.sh script with required parameters.
    """
    if not user_inputs_dir.endswith('/'):
        user_inputs_dir += '/'
    
    cmd = f"""
        set -e
        cd {settings.HPC_BASE_DIR}
        chmod +x {settings.HPC_PIPELINE_SCRIPT} 2>/dev/null || true
        ./{settings.HPC_PIPELINE_SCRIPT} '{user_inputs_dir}' '{req_user_id}' '{email}' '{name}'
    """.strip()
    
    code, out, err = _run_remote(ssh, cmd)
    
    jobs_submitted = ("Job array ID:" in out or "Job ID" in out) and "Submitted" in out
    folders_processed = "Processing:" in out and "NRUNS" in out
    complete_failure = code != 0 and not jobs_submitted and not folders_processed
    
    if complete_failure:
        raise RuntimeError(f"Pipeline script failed with exit code {code}:\nSTDOUT: {out}\nSTDERR: {err}")
    
    if jobs_submitted:
        print(f"INFO: Jobs submitted successfully (exit code: {code})")
        import re
        job_ids = re.findall(r'Job (?:array )?ID:?\s*(\d+)', out)
        if job_ids:
            print(f"INFO: Submitted job IDs: {', '.join(job_ids)}")
    elif folders_processed:
        print(f"WARNING: Folders processed but jobs not submitted (exit code: {code})")
        print(f"WARNING: This may be due to validation errors in input files")
        print(f"WARNING: Files were uploaded successfully to HPC")
    
    return {
        "exit_code": 0 if (jobs_submitted or folders_processed) else code,
        "stdout": out.strip(),
        "stderr": err.strip(),
        "command": f"./pipeline.sh '{user_inputs_dir}' '{req_user_id}' '{email}' '{name}'",
        "jobs_submitted": jobs_submitted,
        "folders_processed": folders_processed
    }


def stage_folders_and_start_pipeline(
    local_folder_paths: Dict[str, str],
    number_of_runs: int,
    gef_probe_radius: int,
    req_user_id: str,
    email: str,
    name: str,
    organization: str,
    description: str,
) -> dict:
    """
    Upload pre-organized local folders to HPC and start pipeline.
    Each local folder is uploaded as-is to HPC, preserving file relationships.
    """
    ssh, sftp = _connect()
    try:
        # Setup base directory structure
        paths = setup_hpc_directories(ssh, req_user_id)
        
        print(f"DEBUG: Uploading {len(local_folder_paths)} folder(s) to HPC...")
        
        # Upload each folder maintaining its structure
        all_folders = []
        for folder_name, local_folder_path in local_folder_paths.items():
            print(f"\nDEBUG: Processing folder: {folder_name}")
            
            # HPC destination for this folder
            hpc_folder_path = posixpath.join(paths["user_inputs_dir"], folder_name)
            
            # Upload entire folder
            uploaded_files = upload_folder_to_hpc(
                ssh=ssh,
                sftp=sftp,
                local_folder_path=local_folder_path,
                hpc_folder_path=hpc_folder_path,
                number_of_runs=number_of_runs,
                gef_probe_radius=gef_probe_radius
            )
            
            # Save metadata for this folder
            metadata = {
                "user_id": req_user_id,
                "email": email,
                "name": name,
                "organization": organization,
                "description": description,
                "number_of_runs": number_of_runs,
                "gef_probe_radius": gef_probe_radius,
                "uploaded_files": uploaded_files,
                "timestamp": int(time.time()),
                "folder": folder_name
            }
            
            metadata_path = posixpath.join(hpc_folder_path, "metadata.json")
            with sftp.file(metadata_path, "w") as f:
                f.write(json.dumps(metadata, indent=2))
            
            all_folders.append({
                'folder_name': folder_name,
                'folder_path': hpc_folder_path,
                'file_count': len(uploaded_files)
            })
        
        print(f"\nDEBUG: Successfully uploaded {len(all_folders)} folder(s) to HPC")
        
        # Sync and verify before calling pipeline
        time.sleep(1)
        
        for folder_info in all_folders:
            verify_cmd = f"ls -la {folder_info['folder_path']}"
            code, out, err = _run_remote(ssh, verify_cmd)
            if code != 0:
                raise RuntimeError(f"Cannot access folder {folder_info['folder_name']} after upload")
            print(f"DEBUG: Verified folder {folder_info['folder_name']} is accessible")
        
        print(f"DEBUG: All folders verified, calling pipeline.sh...")
        
        # Call pipeline script
        pipeline_result = call_pipeline_script(
            ssh=ssh,
            user_inputs_dir=paths["user_inputs_dir"],
            req_user_id=req_user_id,
            email=email,
            name=name
        )
        
        # Build response
        ts = int(time.time())
        meta = {
            "run_name": f"glycomap-{req_user_id[:8]}-{ts}",
            "pid": str(ts),
            "folders": all_folders,
            "folder_count": len(all_folders),
            "hpc_paths": paths,
            "pipeline": pipeline_result,
            "user_inputs_dir": paths["user_inputs_dir"],
            "params": {
                "number_of_runs": number_of_runs,
                "gef_probe_radius": gef_probe_radius,
                "email": email,
                "name": name,
                "organization": organization,
                "description": description
            }
        }
        
        return meta
        
    finally:
        try:
            sftp.close()
        except Exception:
            pass
        ssh.close()
