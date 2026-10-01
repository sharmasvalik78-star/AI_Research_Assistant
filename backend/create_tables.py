from database.db import engine
from database.base import Base

# Import all models before creating tables
from models.user import User
from models.project import Project
from models.document import Document
from models.chat_session import ChatSession
from models.message import Message
from models.research_note import ResearchNote
from models.research_report_share import ResearchReportShare

print("Creating database tables...")

Base.metadata.create_all(bind=engine)

print("Done!")