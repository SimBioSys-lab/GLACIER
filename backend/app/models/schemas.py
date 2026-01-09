from pydantic import BaseModel
from typing import List, Optional

class UploadResponse(BaseModel):
    status: str
    message: str
    email: Optional[str] = None
    name: Optional[str] = None
    files: List[str]
    job_ids: List[str]
    user_id: str
    azure_folder_url: Optional[str] = None
