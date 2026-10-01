from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.session import get_db

from models.document import Document
from models.user import User

from services.document_comparison_service import (
    document_comparison_service,
)


router = APIRouter(
    prefix="/document-comparison",
    tags=["Document Comparison"],
)


class DocumentComparisonRequest(BaseModel):
    document_ids: List[int] = Field(
        ...,
        min_length=2,
        description="IDs of the documents to compare.",
    )

    question: Optional[str] = None

    top_k: int = Field(
        default=12,
        ge=2,
        le=30,
    )


@router.post("")
def compare_documents(
    request: DocumentComparisonRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(
            Document.id.in_(request.document_ids),
            Document.user_id == current_user.id,
        )
        .all()
    )

    found_document_ids = {document.id for document in documents}

    missing_document_ids = [
        document_id
        for document_id in request.document_ids
        if document_id not in found_document_ids
    ]

    if missing_document_ids:
        raise HTTPException(
            status_code=404,
            detail=(
                "One or more selected documents were not found "
                "or do not belong to the current user."
            ),
        )

    if len(found_document_ids) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least two valid documents are required for comparison.",
        )

    try:
        result = document_comparison_service.compare_documents(
            document_ids=request.document_ids,
            question=request.question or "",
            top_k=request.top_k,
        )

        return {
            "document_ids": request.document_ids,
            "answer": result["answer"],
            "context": result["context"],
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )

    except Exception as exc:
        print(f"Document Comparison Error: {exc}")

        raise HTTPException(
            status_code=500,
            detail="Unable to compare the selected documents.",
        )