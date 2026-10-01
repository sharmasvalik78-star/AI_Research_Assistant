from typing import Optional

from sqlalchemy.orm import Session

from models.research_note import ResearchNote
from models.user import User
from models.chat_session import ChatSession


def create_research_note(
    db: Session,
    user: User,
    title: str,
    question: str,
    answer: str,
    citations=None,
    tags=None,
    session: ChatSession | None = None,
) -> ResearchNote:
    """
    Create a new research note.
    """

    title = title.strip()

    if not title:
        title = question.strip()

    if len(title) > 100:
        title = title[:100]

    note = ResearchNote(
        title=title,
        question=question,
        answer=answer,
        citations=citations or [],
        tags=tags or [],
        user_id=user.id,
        session_id=session.id if session else None,
        project_id=session.project_id if session else None,
    )

    db.add(note)
    db.commit()
    db.refresh(note)

    return note


from typing import Optional


def get_research_notes(
    db: Session,
    user: User,
    project_id: Optional[int] = None,
):
    """
    Return research notes for the current user.

    If project_id is provided, only return notes that belong
    to chat sessions in that project.
    """

    query = (
        db.query(ResearchNote)
        .filter(
            ResearchNote.user_id == user.id,
        )
    )

    if project_id is not None:
        query = (
            query.join(
                ChatSession,
                ResearchNote.session_id == ChatSession.id,
            )
            .filter(
                ChatSession.project_id == project_id,
            )
        )

    return (
        query.order_by(
            ResearchNote.created_at.desc()
        )
        .all()
    )


def get_research_notes_by_tag(
    db: Session,
    user: User,
    tag: str,
):
    """
    Return all notes containing the specified tag.
    """

    tag = tag.strip().lower()

    notes = (
        db.query(ResearchNote)
        .filter(ResearchNote.user_id == user.id)
        .order_by(ResearchNote.created_at.desc())
        .all()
    )

    return [
        note
        for note in notes
        if any(t.lower() == tag for t in (note.tags or []))
    ]


def get_all_tags(
    db: Session,
    user: User,
) -> list[str]:
    """
    Return all unique tags for the current user.
    """

    notes = (
        db.query(ResearchNote)
        .filter(ResearchNote.user_id == user.id)
        .all()
    )

    unique_tags: dict[str, str] = {}

    for note in notes:
        for tag in note.tags or []:
            cleaned = tag.strip()

            if not cleaned:
                continue

            key = cleaned.lower()

            if key not in unique_tags:
                unique_tags[key] = cleaned

    return sorted(unique_tags.values(), key=str.lower)


def get_research_note(
    db: Session,
    note_id: int,
    user: User,
):
    """
    Return a single research note.
    """

    return (
        db.query(ResearchNote)
        .filter(
            ResearchNote.id == note_id,
            ResearchNote.user_id == user.id,
        )
        .first()
    )


def update_research_note(
    db: Session,
    note: ResearchNote,
    title: str | None = None,
    is_favorite: bool | None = None,
    tags: list[str] | None = None,
) -> ResearchNote:
    """
    Update an existing research note.
    """

    if title is not None:
        title = title.strip()

        if title:
            if len(title) > 100:
                title = title[:100]

            note.title = title

    if is_favorite is not None:
        note.is_favorite = is_favorite

    if tags is not None:
        cleaned_tags = []

        for tag in tags:
            tag = tag.strip()

            if not tag:
                continue

            if len(tag) > 50:
                tag = tag[:50]

            if tag not in cleaned_tags:
                cleaned_tags.append(tag)

        note.tags = cleaned_tags

    db.commit()
    db.refresh(note)

    return note


def delete_research_note(
    db: Session,
    note: ResearchNote,
):
    """
    Delete a research note.
    """

    db.delete(note)
    db.commit()