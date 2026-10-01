from io import BytesIO

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.session import get_db

from models.user import User

from schemas.research_report import (
    ResearchReportResponse,
)

from services.research_report_service import (
    build_research_report,
)

from services.pdf_export_service import (
    generate_research_report_pdf,
)

from services.docx_export_service import (
    generate_research_report_docx,
)

from services.markdown_export_service import (
    generate_research_report_markdown,
)

router = APIRouter(
    prefix="/research-reports",
    tags=["Research Reports"],
)


@router.get(
    "/{project_id}",
    response_model=ResearchReportResponse,
)
def get_research_report(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Returns the complete research report
    for a project.
    """

    report = build_research_report(
        db=db,
        user=current_user,
        project_id=project_id,
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Research report not found.",
        )

    return report


@router.get("/{project_id}/export/pdf")
def export_research_report_pdf(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Export the research report as a PDF.
    """

    report = build_research_report(
        db=db,
        user=current_user,
        project_id=project_id,
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    pdf_bytes = generate_research_report_pdf(report)

    filename = (
        f"{report.project.name.replace(' ', '_')}_Research_Report.pdf"
    )

    return StreamingResponse(
        BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )


@router.get("/{project_id}/export/docx")
def export_research_report_docx(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Export the research report as a Microsoft Word document.
    """

    report = build_research_report(
        db=db,
        user=current_user,
        project_id=project_id,
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    docx_bytes = generate_research_report_docx(report)

    filename = (
        f"{report.project.name.replace(' ', '_')}_Research_Report.docx"
    )

    return StreamingResponse(
        BytesIO(docx_bytes),
        media_type=(
            "application/vnd.openxmlformats-officedocument."
            "wordprocessingml.document"
        ),
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )


@router.get("/{project_id}/export/md")
def export_research_report_markdown(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Export the research report as Markdown.
    """

    report = build_research_report(
        db=db,
        user=current_user,
        project_id=project_id,
    )

    if report is None:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    markdown_bytes = generate_research_report_markdown(report)

    filename = (
        f"{report.project.name.replace(' ', '_')}_Research_Report.md"
    )

    return StreamingResponse(
        BytesIO(markdown_bytes),
        media_type="text/markdown",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        },
    )