from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from database.base import Base


class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)

    filename = Column(String, nullable=False)

    original_filename = Column(String, nullable=False)

    file_path = Column(String, nullable=False)

    file_size = Column(Integer, nullable=False)

    content_type = Column(String, nullable=False)

    uploaded_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=True,
    )

    user = relationship(
        "User",
        back_populates="documents",
    )

    project = relationship(
        "Project",
        back_populates="documents",
    )