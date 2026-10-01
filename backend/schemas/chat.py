from typing import Optional

from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str

    # Backward compatibility
    document_id: Optional[int] = None

    # Multi-document support
    document_ids: Optional[list[int]] = None

    # Project-aware chat support
    project_id: Optional[int] = None

    session_id: Optional[int] = None


class Citation(BaseModel):
    filename: str


class ChatResponse(BaseModel):
    answer: str
    context: list[Citation]
    session_id: int


class CreateChatSessionRequest(BaseModel):
    title: str = "New Chat"
    project_id: Optional[int] = None


class RenameChatRequest(BaseModel):
    title: str


class ChatSessionResponse(BaseModel):
    id: int
    title: str
    project_id: Optional[int] = None

    class Config:
        from_attributes = True