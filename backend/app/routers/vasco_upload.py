"""
VASCO (Viral Antibody Structural Complex Analysis) Upload Router

Handles file uploads and job submission for antibody-antigen interface prediction.
"""
import os
import uuid
import json
import time
from typing import Optional
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, BackgroundTasks

from app.config import settings
from app.logging_config import setup_logging
from app.services.vasco_hpc import submit_vasco_job

logger = setup_logging()
router = APIRouter(prefix="/vasco", tags=["vasco"])


@router.post("/upload")
async def upload_vasco_structure(
    background: BackgroundTasks,
    antibody_file: UploadFile = File(..., description="Antibody PDB file (L + H chains)"),
    antigen_file: UploadFile = File(..., description="Antigen PDB file"),
    light_chain: str = Form("L", description="Light chain ID"),
    heavy_chain: str = Form("H", description="Heavy chain ID"),
    antigen_chains: str = Form("", description="Antigen chain IDs (comma-separated, optional)"),
    email: str = Form(..., description="Email for notifications"),
    name: str = Form(..., description="Full name"),
    organization: str = Form("", description="Organization"),
    description: str = Form("", description="Project description"),
):
    """
    Upload antibody and antigen PDB files for VASCO interface prediction.
    
    Process:
    1. Validate PDB files
    2. Save locally
    3. Transfer to HPC
    4. Submit SLURM job
    5. Return job ID
    
    Returns:
        {
            "status": "success",
            "user_id": "uuid",
            "job_id": "slurm_job_id",
            "message": "VASCO analysis started",
            "estimated_time": "4-8 hours"
        }
    """
    
    # Validate files
    if not antibody_file.filename:
        raise HTTPException(status_code=400, detail="No antibody file provided")
    if not antigen_file.filename:
        raise HTTPException(status_code=400, detail="No antigen file provided")
    
    if not antibody_file.filename.lower().endswith('.pdb'):
        raise HTTPException(status_code=400, detail="Antibody file must be .pdb format")
    if not antigen_file.filename.lower().endswith('.pdb'):
        raise HTTPException(status_code=400, detail="Antigen file must be .pdb format")
    
    # Validate chain IDs
    if not light_chain or len(light_chain) != 1:
        raise HTTPException(status_code=400, detail="Light chain must be a single character")
    if not heavy_chain or len(heavy_chain) != 1:
        raise HTTPException(status_code=400, detail="Heavy chain must be a single character")
    
    # Generate user ID
    user_id = str(uuid.uuid4())
    
    # Create local directory
    vasco_upload_dir = os.path.join(settings.UPLOAD_FOLDER, "vasco")
    os.makedirs(vasco_upload_dir, exist_ok=True)
    
    user_dir = os.path.join(vasco_upload_dir, user_id)
    os.makedirs(user_dir, exist_ok=True)
    
    logger.info(f"VASCO upload started for user {user_id}")
    
    # Save files locally
    antibody_path = os.path.join(user_dir, "antibody.pdb")
    antigen_path = os.path.join(user_dir, "antigen.pdb")
    
    try:
        # Save antibody file
        with open(antibody_path, "wb") as f:
            content = await antibody_file.read()
            f.write(content)
        logger.info(f"Saved antibody file: {antibody_file.filename} ({len(content)} bytes)")
        
        # Save antigen file
        with open(antigen_path, "wb") as f:
            content = await antigen_file.read()
            f.write(content)
        logger.info(f"Saved antigen file: {antigen_file.filename} ({len(content)} bytes)")
        
    except Exception as e:
        logger.error(f"Failed to save files: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save files: {str(e)}")
    
    # Save metadata
    metadata = {
        "user_id": user_id,
        "email": email,
        "name": name,
        "organization": organization,
        "description": description,
        "light_chain": light_chain,
        "heavy_chain": heavy_chain,
        "antigen_chains": antigen_chains,
        "antibody_filename": antibody_file.filename,
        "antigen_filename": antigen_file.filename,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "unix_timestamp": time.time()
    }
    
    metadata_path = os.path.join(user_dir, "metadata.json")
    with open(metadata_path, "w") as f:
        json.dump(metadata, f, indent=2)
    
    # Submit to HPC
    try:
        job_info = submit_vasco_job(
            user_id=user_id,
            local_antibody_path=antibody_path,
            local_antigen_path=antigen_path,
            light_chain=light_chain,
            heavy_chain=heavy_chain,
            antigen_chains=antigen_chains,
            email=email,
            name=name
        )
        
        logger.info(f"VASCO job submitted: {job_info}")
        
        return {
            "status": "success",
            "user_id": user_id,
            "job_id": job_info.get("slurm_job_id", "pending"),
            "azure_folder_url": job_info.get("azure_folder_url"),  # Azure URL from HPC
            "message": "VASCO analysis started successfully",
            "estimated_time": "4-8 hours"
        }
        
    except Exception as e:
        logger.exception(f"HPC submission failed for user {user_id}: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to submit VASCO job to HPC: {str(e)}"
        )


@router.get("/status/{user_id}")
async def get_vasco_status(user_id: str):
    """
    Check the status of a VASCO analysis job.
    
    Returns:
        {
            "status": "queued" | "running" | "completed" | "failed",
            "user_id": "uuid",
            "current_step": "Step 3/8: Generating MSA",
            "message": "Analysis in progress"
        }
    """
    # TODO: Implement status checking by reading HPC output files
    # For now, return a placeholder
    return {
        "status": "running",
        "user_id": user_id,
        "current_step": "Processing",
        "message": "Analysis in progress"
    }


@router.get("/results/{user_id}")
async def get_vasco_results(user_id: str):
    """
    Retrieve results for a completed VASCO analysis.
    
    Returns:
        {
            "status": "success",
            "user_id": "uuid",
            "results": {
                "predictions_csv": "download_url",
                "heatmap_png": "download_url",
                "summary_txt": "download_url"
            },
            "statistics": {
                "total_residues": int,
                "interface_residues": int,
                "interface_percentage": float
            }
        }
    """
    # TODO: Implement results retrieval from HPC or Azure storage
    # For now, return placeholder
    return {
        "status": "pending",
        "user_id": user_id,
        "message": "Results not yet available"
    }
