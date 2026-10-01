from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.session import get_db

from models.user import User
from models.chat_session import ChatSession

from schemas.research_note import (
    ResearchNoteCreate,
    ResearchNoteUpdate,
    ResearchNoteResponse,
)

from services.research_note_service import (
    create_research_note,
    get_research_notes,
    get_research_note,
    update_research_note,
    delete_research_note,
)

router = APIRouter(
    prefix="/research-notes",
    tags=["Research Notes"],
)


@router.post(
    "",
    response_model=ResearchNoteResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_note(
    request: ResearchNoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Create a new research note.
    """

    session = None

    if request.session_id is not None:
        session = (
            db.query(ChatSession)
            .filter(
                ChatSession.id == request.session_id,
                ChatSession.user_id == current_user.id,
            )
            .first()
        )

        if session is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Chat session not found.",
            )

    return create_research_note(
        db=db,
        user=current_user,
        title=request.title,
        question=request.question,
        answer=request.answer,
        citations=request.citations,
        tags=request.tags,
        session=session,
    )


@router.get(
    "",
    response_model=list[ResearchNoteResponse],
)
def list_notes(
    project_id: int | None = Query(default=None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return research notes for the current user.

    If project_id is supplied, only notes belonging to that
    project are returned.
    """

    return get_research_notes(
        db=db,
        user=current_user,
        project_id=project_id,
    )


@router.get(
    "/{note_id}",
    response_model=ResearchNoteResponse,
)
def get_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Return a single research note.
    """

    note = get_research_note(
        db=db,
        note_id=note_id,
        user=current_user,
    )

    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research note not found.",
        )

    return note


@router.put(
    "/{note_id}",
    response_model=ResearchNoteResponse,
)
def update_note(
    note_id: int,
    request: ResearchNoteUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Update a research note.
    """

    note = get_research_note(
        db=db,
        note_id=note_id,
        user=current_user,
    )

    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research note not found.",
        )

    return update_research_note(
        db=db,
        note=note,
        title=request.title,
        is_favorite=request.is_favorite,
        tags=request.tags,
    )


@router.delete(
    "/{note_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_note(
    note_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Delete a research note.
    """

    note = get_research_note(
        db=db,
        note_id=note_id,
        user=current_user,
    )

    if note is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Research note not found.",
        )

    delete_research_note(
        db=db,
        note=note,
    )

    return None