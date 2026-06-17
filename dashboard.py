from fastapi import APIRouter
from services.rag_service import collection

router = APIRouter(prefix="/dashboard")

@router.get("/stats")
def stats():
    count = collection.count()

    return {
        "vectors": count,
        "documents": count,
        "chromadb": "Connected"
    }