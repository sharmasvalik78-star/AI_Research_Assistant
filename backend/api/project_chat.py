from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.session import get_db

from models.user import User

from schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatSessionResponse,
    CreateChatSessionRequest,
    RenameChatRequest,
)

from services.project_chat_service import (
    get_project,
    list_project_chats,
    create_project_chat,
    rename_project_chat,
    remove_project_chat,
    get_project_messages,
    ask_project_question,
)

router = APIRouter(
    prefix="/projects",
    tags=["Project Chat"],
)


# ----------------------------------------------------
# List Project Chats
# ----------------------------------------------------

@router.get(
    "/{project_id}/chats",
    response_model=list[ChatSessionResponse],
)
def list_chats(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project(
        db=db,
        project_id=project_id,
        user=current_user,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return list_project_chats(
        db=db,
        project_id=project_id,
        user=current_user,
    )


# ----------------------------------------------------
# Create Project Chat
# ----------------------------------------------------

@router.post(
    "/{project_id}/chats",
    response_model=ChatSessionResponse,
)
def create_chat(
    project_id: int,
    request: CreateChatSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = get_project(
        db=db,
        project_id=project_id,
        user=current_user,
    )

    if project is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    return create_project_chat(
        db=db,
        project_id=project_id,
        user=current_user,
        title=request.title,
    )


# ----------------------------------------------------
# Project Chat Messages
# ----------------------------------------------------

@router.get(
    "/{project_id}/chats/{chat_id}/messages",
)
def chat_messages(
    project_id: int,
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    messages = get_project_messages(
        db=db,
        project_id=project_id,
        chat_id=chat_id,
        user=current_user,
    )

    if messages is None:
        raise HTTPException(
            status_code=404,
            detail="Chat not found.",
        )

    return messages


# ----------------------------------------------------
# Rename Project Chat
# ----------------------------------------------------

@router.put(
    "/{project_id}/chats/{chat_id}",
    response_model=ChatSessionResponse,
)
def rename_chat(
    project_id: int,
    chat_id: int,
    request: RenameChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = rename_project_chat(
        db=db,
        project_id=project_id,
        chat_id=chat_id,
        title=request.title,
        user=current_user,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat not found.",
        )

    return session


# ----------------------------------------------------
# Delete Project Chat
# ----------------------------------------------------

@router.delete(
    "/{project_id}/chats/{chat_id}",
)
def delete_chat(
    project_id: int,
    chat_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    deleted = remove_project_chat(
        db=db,
        project_id=project_id,
        chat_id=chat_id,
        user=current_user,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Chat not found.",
        )

    return {
        "message": "Project chat deleted successfully."
    }


# ----------------------------------------------------
# Ask AI (Project Chat)
# ----------------------------------------------------

@router.post(
    "/{project_id}/chat",
    response_model=ChatResponse,
)
def ask_question(
    project_id: int,
    request: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    question = request.question.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Question cannot be empty.",
        )

    if request.session_id is None:
        raise HTTPException(
            status_code=400,
            detail="session_id is required.",
        )

    response = ask_project_question(
        db=db,
        project_id=project_id,
        chat_id=request.session_id,
        question=question,
        document_ids=request.document_ids,   # <-- NEW
        user=current_user,
    )

    if response is None:
        raise HTTPException(
            status_code=404,
            detail="Project chat not found.",
        )

    return ChatResponse(
        answer=response["answer"],
        context=response["context"],
        session_id=response["session_id"],
    )