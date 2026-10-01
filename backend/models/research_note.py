from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Boolean,
    DateTime,
    ForeignKey,
    JSON,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from database.base import Base


class ResearchNote(Base):
    __tablename__ = "research_notes"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String,
        nullable=False,
    )

    question = Column(
        Text,
        nullable=False,
    )

    answer = Column(
        Text,
        nullable=False,
    )

    citations = Column(
        JSON,
        nullable=True,
        default=list,
    )

    tags = Column(
        JSON,
        nullable=False,
        default=list,
    )

    is_favorite = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
    )

    user_id = Column(
        Integer,
        ForeignKey(
            "users.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    session_id = Column(
        Integer,
        ForeignKey(
            "chat_sessions.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    project_id = Column(
        Integer,
        ForeignKey(
            "projects.id",
            ondelete="SET NULL",
        ),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="research_notes",
    )

    session = relationship(
        "ChatSession",
        back_populates="research_notes",
    )

    project = relationship(
        "Project",
        back_populates="research_notes",
    )