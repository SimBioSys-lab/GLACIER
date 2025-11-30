import os
import time
import uuid
from typing import List, Dict
from fastapi import APIRouter, BackgroundTasks, Depends, File, Form, UploadFile, HTTPException
from app.config import settings
from app.logging_config import setup_logging
from app.services.storage import ensure_directory_structure
from app.models.schemas import UploadResponse
from app.deps import bind_user_id
from app.context import user_id_var
from typing import List, Optional
from app.services.hpc import stage_folders_and_start_pipeline

logger = setup_logging()
router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload(
    background: BackgroundTasks,
    email: str = Form(...),
    name: str = Form(...),
    organization: str = Form(""),
    description: str = Form(""),
    numberOfRuns: int = Form(1),
    GEFProbeRadius: int = Form(3),
    user_id: Optional[str] = Form(None),
    files: List[UploadFile] = File(..., alias="files"),
    file_folders: List[str] = Form(...),  # Folder name for each file
    _ = Depends(bind_user_id),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files uploaded")
    if len(files) > 10:
        raise HTTPException(status_code=400, detail="Too many files; max 10")
    if len(file_folders) != len(files):
        raise HTTPException(status_code=400, detail="Folder information mismatch")

    ensure_directory_structure()

    req_user_id = user_id or str(uuid.uuid4())
    user_id_var.set(req_user_id)

    # Create user directory (organized like HPC structure: uploads/{user_id}/)
    user_dir = os.path.join(settings.UPLOAD_FOLDER, req_user_id)
    os.makedirs(user_dir, exist_ok=True)

    # Save metadata at user level
    timestamp = time.strftime("%Y%m%d%H%M%S")
    with open(os.path.join(user_dir, "user_info.txt"), "w") as f:
        f.write(
            f"Name: {name}\n"
            f"Email: {email}\n"
            f"Organization: {organization}\n"
            f"Description: {description}\n"
            f"Number of Runs: {numberOfRuns}\n"
            f"GEF Probe Radius: {GEFProbeRadius}\n"
            f"User ID: {req_user_id}\n"
            f"Timestamp: {timestamp}\n"
        )

    # Organize files by their original folder
    folder_groups: Dict[str, List[tuple]] = {}
    for file, folder_name in zip(files, file_folders):
        if folder_name not in folder_groups:
            folder_groups[folder_name] = []
        # Extract just the filename, not the full path
        filename = os.path.basename(file.filename) if file.filename else 'unknown'
        folder_groups[folder_name].append((file, filename))
    
    logger.info(f"Organized {len(files)} files into {len(folder_groups)} folder(s): {list(folder_groups.keys())}")

    # Save files maintaining exact folder structure from frontend
    local_folder_paths = {}
    for folder_name, folder_files in folder_groups.items():
        folder_path = os.path.join(user_dir, folder_name)
        os.makedirs(folder_path, exist_ok=True)
        
        for file, filename in folder_files:
            dest = os.path.join(folder_path, filename)
            with open(dest, "wb") as fh:
                content = file.file.read()
                fh.write(content)
        
        local_folder_paths[folder_name] = folder_path
        logger.info(f"Saved {len(folder_files)} files to local folder: {folder_name}")

    try:
        run_meta = stage_folders_and_start_pipeline(
            local_folder_paths=local_folder_paths,
            number_of_runs=numberOfRuns,
            gef_probe_radius=GEFProbeRadius,
            req_user_id=req_user_id,
            email=email,
            name=name,
            organization=organization,
            description=description,
        )
    except Exception as e:
        logger.exception(f"HPC submit failed: {e}")
        raise HTTPException(status_code=500, detail=f"HPC submit failed: {e}")

    # Collect all filenames for response
    all_files = [filename for _, filename in sum(folder_groups.values(), [])]

    return UploadResponse(
        status="success",
        message="Files uploaded and pipeline started",
        email=email,
        name=name,
        files=all_files,
        job_ids=[str(run_meta["pid"])],
        user_id=req_user_id,
        azure_folder_url=run_meta.get("azure_folder_url"),
    )
