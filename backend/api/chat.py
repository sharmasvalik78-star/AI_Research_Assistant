from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from database.session import get_db
from core.auth import get_current_user

from models.user import User

from schemas.chat import (
    ChatRequest,
    ChatResponse,
    CreateChatSessionRequest,
    RenameChatRequest,
    ChatSessionResponse,
)

from services.rag_service import rag_service
from services.gemini_stream_service import (
    gemini_stream_service,
)
from services.chat_service import (
    create_chat_session,
    get_chat_session,
    get_chat_sessions,
    rename_chat_session,
    delete_chat_session,
)
from services.message_service import (
    save_message,
    get_session_messages,
)

router = APIRouter(
    prefix="/chat",
    tags=["AI Chat"],
)


# ----------------------------------------------------
# Ask Question
# ----------------------------------------------------

@router.post(
    "/ask",
    response_model=ChatResponse,
)
async def ask_question(
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

        session = create_chat_session(
            db=db,
            user=current_user,
            title=question,
        )

    else:

        session = get_chat_session(
            db=db,
            session_id=request.session_id,
            user=current_user,
        )

        if session is None:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found.",
            )

    save_message(
        db=db,
        session=session,
        role="user",
        content=question,
    )

    print("=" * 60)
    print("document_id:", request.document_id)
    print("document_ids:", request.document_ids)
    print("=" * 60)

    result = rag_service.ask(
        question=question,
        document_id=request.document_id,
        document_ids=request.document_ids,
    )

    save_message(
        db=db,
        session=session,
        role="assistant",
        content=result["answer"],
        citations=result["context"],
    )

    return ChatResponse(
        answer=result["answer"],
        context=result["context"],
        session_id=session.id,
    )


# ----------------------------------------------------
# List Sessions
# ----------------------------------------------------

@router.get(
    "/sessions",
    response_model=list[ChatSessionResponse],
)
def list_sessions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return get_chat_sessions(
        db=db,
        user=current_user,
    )

# ----------------------------------------------------
# Create Empty Session
# ----------------------------------------------------

@router.post(
    "/sessions",
    response_model=ChatSessionResponse,
)
def create_session(
    request: CreateChatSessionRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_chat_session(
        db=db,
        user=current_user,
        title=request.title,
        project_id=request.project_id,
    )


# ----------------------------------------------------
# Session Messages
# ----------------------------------------------------

@router.get(
    "/sessions/{session_id}/messages",
)
def session_messages(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_chat_session(
        db=db,
        session_id=session_id,
        user=current_user,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found.",
        )

    return get_session_messages(
        db=db,
        session=session,
    )


# ----------------------------------------------------
# Rename Session
# ----------------------------------------------------

@router.put(
    "/sessions/{session_id}",
    response_model=ChatSessionResponse,
)
def rename_session(
    session_id: int,
    request: RenameChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_chat_session(
        db=db,
        session_id=session_id,
        user=current_user,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found.",
        )

    return rename_chat_session(
        db=db,
        session=session,
        title=request.title,
    )


# ----------------------------------------------------
# Delete Session
# ----------------------------------------------------

@router.delete(
    "/sessions/{session_id}",
)
def delete_session(
    session_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    session = get_chat_session(
        db=db,
        session_id=session_id,
        user=current_user,
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail="Chat session not found.",
        )

    delete_chat_session(
        db=db,
        session=session,
    )

    return {
        "message": "Chat session deleted successfully."
    }

    # ----------------------------------------------------
# Stream AI Response
# ----------------------------------------------------

@router.post("/stream")
async def stream_question(
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

    # Create or retrieve chat session
    if request.session_id is None:

        session = create_chat_session(
            db=db,
            user=current_user,
            title=question,
            project_id=request.project_id,
        )

    else:

        session = get_chat_session(
            db=db,
            session_id=request.session_id,
            user=current_user,
        )

        if session is None:
            raise HTTPException(
                status_code=404,
                detail="Chat session not found.",
            )

    # Save user message
    save_message(
        db=db,
        session=session,
        role="user",
        content=question,
    )

    # Retrieve RAG context
    result = rag_service.ask(
        question=question,
        document_id=request.document_id,
        document_ids=request.document_ids,
    )

    context = result["context"]

    def generate():

        full_answer = ""

        for chunk in gemini_stream_service.stream_answer(
            question=question,
            context=context,
        ):
            full_answer += chunk
            yield chunk

        # Save assistant message after streaming completes
        save_message(
            db=db,
            session=session,
            role="assistant",
            content=full_answer,
            citations=result["context"],
        )

    return StreamingResponse(
        generate(),
        media_type="text/plain",
    )

    return {
        "message": "Chat session deleted successfully."
    }