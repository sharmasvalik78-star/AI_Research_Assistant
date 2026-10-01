from datetime import datetime

from pydantic import BaseModel


class DocumentResponse(BaseModel):
    id: int
    filename: str
    size: int
    content_type: str
    uploaded_at: datetime
    project_id: int | None = None

    class Config:
        from_attributes = True