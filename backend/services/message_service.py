from sqlalchemy.orm import Session

from models.message import Message
from models.chat_session import ChatSession


def save_message(
    db: Session,
    session: ChatSession,
    role: str,
    content: str,
    citations=None,
) -> Message:
    """
    Save a single message to a chat session.
    """

    message = Message(
        session_id=session.id,
        role=role,
        content=content,
        citations=citations,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return message


def get_session_messages(
    db: Session,
    session: ChatSession,
):
    """
    Return all messages belonging to a chat session.
    """

    messages = (
        db.query(Message)
        .filter(Message.session_id == session.id)
        .order_by(Message.created_at.asc())
        .all()
    )

    result = []

    for message in messages:
        result.append(
            {
                "id": message.id,
                "role": message.role,
                "content": message.content,
                "created_at": message.created_at,
                # Keep frontend compatible
                "context": message.citations or [],
            }
        )

    return result