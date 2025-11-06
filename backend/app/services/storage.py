import os
from app.config import settings

def ensure_directory_structure() -> None:
    """Ensure local directories exist (not HPC directories)"""
    # Only create local upload folder
    os.makedirs(settings.UPLOAD_FOLDER, exist_ok=True)
    
    # Create a local logs directory if LOG_FILE specifies a path with directory
    log_dir = os.path.dirname(settings.LOG_FILE)
    # Only create directory if log_dir is not empty and not current directory
    if log_dir and log_dir != '.' and log_dir != '':
        os.makedirs(log_dir, exist_ok=True)

    # Write permission probe for upload folder
    test_file = os.path.join(settings.UPLOAD_FOLDER, ".test_write_permissions")
    try:
        with open(test_file, "w") as f:
            f.write("ok")
        os.remove(test_file)
    except Exception as e:
        raise RuntimeError(f"Cannot write to upload folder {settings.UPLOAD_FOLDER}: {e}")