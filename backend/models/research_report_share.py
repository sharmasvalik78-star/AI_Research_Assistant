from datetime import datetime

from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
)

from database.base import Base


class ResearchReportShare(Base):
    """
    Stores share information for research reports.
    """

    __tablename__ = "research_report_shares"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    share_token = Column(
        String(128),
        unique=True,
        nullable=False,
        index=True,
    )

    is_public = Column(
        Boolean,
        default=False,
        nullable=False,
    )

    allow_download = Column(
        Boolean,
        default=True,
        nullable=False,
    )

    expires_at = Column(
        DateTime,
        nullable=True,
    )

    access_count = Column(
        Integer,
        default=0,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )