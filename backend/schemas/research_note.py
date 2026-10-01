from typing import Optional

from pydantic import BaseModel, Field


class ResearchNoteCreate(BaseModel):
    title: str
    question: str
    answer: str
    citations: list[dict] = Field(default_factory=list)
    tags: list[str] = Field(default_factory=list)
    session_id: Optional[int] = None


class ResearchNoteUpdate(BaseModel):
    title: Optional[str] = None
    is_favorite: Optional[bool] = None
    tags: Optional[list[str]] = None


class ResearchNoteResponse(BaseModel):
    id: int
    title: str
    question: str
    answer: str
    citations: list[dict]
    tags: list[str]
    is_favorite: bool
    session_id: Optional[int]

    class Config:
        from_attributes = True