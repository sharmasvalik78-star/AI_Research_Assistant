from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel


# =====================================================
# Project
# =====================================================

class ReportProject(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# =====================================================
# Document
# =====================================================

class ReportDocument(BaseModel):
    id: int
    filename: str
    uploaded_at: datetime

    class Config:
        from_attributes = True


# =====================================================
# Chat Session
# =====================================================

class ReportChatSession(BaseModel):
    id: int
    title: str
    created_at: datetime
    message_count: int

    class Config:
        from_attributes = True


# =====================================================
# Research Note
# =====================================================

class ReportResearchNote(BaseModel):
    id: int
    title: str
    created_at: datetime
    is_favorite: bool
    tags: List[str] = []

    class Config:
        from_attributes = True


# =====================================================
# Citation
# =====================================================

class ReportCitation(BaseModel):
    filename: str
    chunk: int
    apa: str = ""
    ieee: str = ""
    mla: str = ""


# =====================================================
# Analytics
# =====================================================

class ReportAnalytics(BaseModel):
    total_projects: int
    total_documents: int
    total_chat_sessions: int
    total_messages: int
    total_research_notes: int


# =====================================================
# AI Summary (used in future phases)
# =====================================================

class ReportAISummary(BaseModel):
    executive_summary: str = ""
    research_summary: str = ""
    productivity_insights: str = ""


# =====================================================
# Complete Research Report
# =====================================================

class ResearchReportResponse(BaseModel):
    project: ReportProject

    analytics: ReportAnalytics

    documents: List[ReportDocument] = []

    chat_sessions: List[ReportChatSession] = []

    research_notes: List[ReportResearchNote] = []

    citations: List[ReportCitation] = []

    ai_summary: ReportAISummary

    allow_download: bool = False