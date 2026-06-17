from fastapi import APIRouter
from services.rag_service import collection
from pathlib import Path

router = APIRouter()


@router.get("/dashboard/stats")
def stats():

    uploads_dir = Path("uploads/files")

    document_count = 0

    if uploads_dir.exists():
        document_count = len(
            [f for f in uploads_dir.iterdir() if f.is_file()]
        )

    return {
        "vectors": collection.count(),
        "documents": document_count,
        "chromadb": "Connected"
    }


@router.get("/dashboard/files")
def files():

    uploads_dir = Path("uploads/files")

    return {
        "files": [
            f.name
            for f in uploads_dir.iterdir()
            if f.is_file()
        ]
    }