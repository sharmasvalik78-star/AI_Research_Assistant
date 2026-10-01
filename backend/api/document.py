from pathlib import Path
import shutil
import uuid
import os
from typing import Optional, List

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
    Query,
)
from sqlalchemy.orm import Session

from core.auth import get_current_user
from database.session import get_db

from models.document import Document
from models.project import Project
from models.user import User

from services.document_parser import DocumentParser
from services.text_chunker import TextChunker
from services.chroma_service import chroma_service
from services.research_timeline_service import research_timeline_service
from services.knowledge_graph_service import knowledge_graph_service
from services.research_gap_service import research_gap_service
from services.presentation_service import presentation_service
from services.research_question_service import research_question_service
from services.research_methodology_service import (
    research_methodology_service,
)
from schemas.document_response import DocumentResponse

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)


# ======================================================
# Upload Document
# ======================================================

@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    project_id: Optional[int] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    allowed_extensions = {
        ".pdf",
        ".doc",
        ".docx",
        ".txt",
    }

    extension = Path(file.filename).suffix.lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Only PDF, DOC, DOCX and TXT files are allowed.",
        )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

    unique_filename = f"{uuid.uuid4()}{extension}"
    file_path = UPLOAD_DIR / unique_filename

    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    document = Document(
        filename=unique_filename,
        original_filename=file.filename,
        file_path=str(file_path),
        file_size=file_path.stat().st_size,
        content_type=file.content_type or "application/octet-stream",
        user_id=current_user.id,
        project_id=project_id,
    )

    db.add(document)
    db.commit()
    db.refresh(document)

    try:
        text = DocumentParser.parse(str(file_path))

        chunks = TextChunker.chunk_text(text)

        if chunks:
            chroma_service.add_document_chunks(
                document_id=document.id,
                chunks=chunks,
                filename=document.original_filename,
            )

    except Exception as e:
        print(f"Chroma Indexing Error: {e}")

    return {
        "message": "Document uploaded successfully",
        "document_id": document.id,
        "filename": document.original_filename,
        "chunks_indexed": len(chunks) if "chunks" in locals() else 0,
    }


# ======================================================
# Get My Documents
# ======================================================

@router.get("")
def get_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return [
        {
            "id": doc.id,
            "filename": doc.original_filename,
            "size": doc.file_size,
            "content_type": doc.content_type,
            "uploaded_at": doc.uploaded_at,
            "project_id": doc.project_id,
        }
        for doc in documents
    ]


# ======================================================
# Get Project Documents
# ======================================================

@router.get("/project/{project_id}")
def get_project_documents(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    project = (
        db.query(Project)
        .filter(
            Project.id == project_id,
            Project.user_id == current_user.id,
        )
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    documents = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id,
            Document.project_id == project_id,
        )
        .order_by(Document.uploaded_at.desc())
        .all()
    )

    return [
        {
            "id": doc.id,
            "filename": doc.original_filename,
            "size": doc.file_size,
            "content_type": doc.content_type,
            "uploaded_at": doc.uploaded_at,
            "project_id": doc.project_id,
        }
        for doc in documents
    ]


# ======================================================
# Research Timeline Generation
# ======================================================

@router.post("/timeline")
def generate_research_timeline(
    document_ids: Optional[List[int]] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
    )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        query = query.filter(
            Document.project_id == project_id
        )

    if document_ids:
        query = query.filter(
            Document.id.in_(document_ids)
        )

    documents = query.all()

    if not documents:
        raise HTTPException(
            status_code=404,
            detail="No documents found.",
        )

    context_parts = []

    for document in documents:

        if not os.path.exists(document.file_path):
            continue

        try:
            text = DocumentParser.parse(
                document.file_path
            )

            if text and text.strip():
                context_parts.append(
                    f"""
DOCUMENT: {document.original_filename}

{text}
"""
                )

        except Exception as e:
            print(
                f"Timeline Parsing Error for "
                f"document {document.id}: {e}"
            )

    if not context_parts:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract text from the selected documents.",
        )

    context = "\n\n".join(context_parts)

    try:
        timeline = research_timeline_service.generate_timeline(
            context=context
        )

    except Exception as e:
        print(
            f"Research Timeline Generation Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate research timeline.",
        )

    return {
        "message": "Research timeline generated successfully",
        "timeline": timeline,
        "documents_used": [
            {
                "id": document.id,
                "filename": document.original_filename,
            }
            for document in documents
        ],
    }


# ======================================================
# Delete Document
# ======================================================

@router.delete("/{document_id}")
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    document = (
        db.query(Document)
        .filter(
            Document.id == document_id,
            Document.user_id == current_user.id,
        )
        .first()
    )

    if not document:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Document not found",
        )

    if os.path.exists(document.file_path):
        os.remove(document.file_path)

    try:
        chroma_service.delete_document(document.id)
    except Exception as e:
        print(f"Chroma Delete Error: {e}")

    db.delete(document)
    db.commit()

    return {
        "message": "Document deleted successfully"
    }


# ======================================================
# Re-index Existing Documents into Chroma
# ======================================================

@router.post("/reindex")
def reindex_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .all()
    )

    indexed_documents = 0
    indexed_chunks = 0

    for document in documents:
        if not os.path.exists(document.file_path):
            continue

        try:
            text = DocumentParser.parse(document.file_path)
            chunks = TextChunker.chunk_text(text)

            if chunks:
                chroma_service.add_document_chunks(
                    document_id=document.id,
                    chunks=chunks,
                    filename=document.original_filename,
                )

                indexed_documents += 1
                indexed_chunks += len(chunks)

        except Exception as e:
            print(
                f"Re-index Error for document {document.id}: {e}"
            )

    return {
        "message": "Existing documents re-indexed successfully",
        "documents_indexed": indexed_documents,
        "chunks_indexed": indexed_chunks,
    }


# ======================================================
# Knowledge Graph Generation
# ======================================================

@router.post("/knowledge-graph")
def generate_knowledge_graph(
    document_ids: Optional[List[int]] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
    )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        query = query.filter(
            Document.project_id == project_id
        )

    if document_ids:
        query = query.filter(
            Document.id.in_(document_ids)
        )

    documents = query.all()

    if not documents:
        raise HTTPException(
            status_code=404,
            detail="No documents found.",
        )

    context_parts = []

    for document in documents:

        if not os.path.exists(document.file_path):
            continue

        try:
            text = DocumentParser.parse(
                document.file_path
            )

            if text and text.strip():
                context_parts.append(
                    f"""
DOCUMENT: {document.original_filename}

{text}
"""
                )

        except Exception as e:
            print(
                f"Knowledge Graph Parsing Error for "
                f"document {document.id}: {e}"
            )

    if not context_parts:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract text from the selected documents.",
        )

    context = "\n\n".join(context_parts)

    try:
        graph = knowledge_graph_service.generate_graph(
            context=context
        )

    except Exception as e:
        print(
            f"Knowledge Graph Generation Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate knowledge graph.",
        )

    return {
        "message": "Knowledge graph generated successfully",
        "graph": graph,
        "documents_used": [
            {
                "id": document.id,
                "filename": document.original_filename,
            }
            for document in documents
        ],
    }


# ======================================================
# Research Gap Detection
# ======================================================

@router.post("/research-gaps")
def detect_research_gaps(
    document_ids: Optional[List[int]] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
    )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        query = query.filter(
            Document.project_id == project_id
        )

    if document_ids:
        query = query.filter(
            Document.id.in_(document_ids)
        )

    documents = query.all()

    if not documents:
        raise HTTPException(
            status_code=404,
            detail="No documents found.",
        )

    context_parts = []

    for document in documents:

        if not os.path.exists(document.file_path):
            continue

        try:
            text = DocumentParser.parse(
                document.file_path
            )

            if text and text.strip():
                context_parts.append(
                    f"""
DOCUMENT: {document.original_filename}

{text}
"""
                )

        except Exception as e:
            print(
                f"Research Gap Parsing Error for "
                f"document {document.id}: {e}"
            )

    if not context_parts:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract text from the selected documents.",
        )

    context = "\n\n".join(context_parts)

    try:
        gaps = research_gap_service.detect_gaps(
            context=context
        )

    except Exception as e:
        print(
            f"Research Gap Detection Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to detect research gaps.",
        )

    return {
        "message": "Research gaps detected successfully",
        "research_gaps": gaps,
        "documents_used": [
            {
                "id": document.id,
                "filename": document.original_filename,
            }
            for document in documents
        ],
    }


# ======================================================
# AI Research Presentation Generation
# ======================================================

@router.post("/presentation")
def generate_research_presentation(
    document_ids: Optional[List[int]] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
    )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        query = query.filter(
            Document.project_id == project_id
        )

    if document_ids:
        query = query.filter(
            Document.id.in_(document_ids)
        )

    documents = query.all()

    if not documents:
        raise HTTPException(
            status_code=404,
            detail="No documents found.",
        )

    context_parts = []

    for document in documents:

        if not os.path.exists(document.file_path):
            continue

        try:
            text = DocumentParser.parse(
                document.file_path
            )

            if text and text.strip():
                context_parts.append(
                    f"""
DOCUMENT: {document.original_filename}

{text}
"""
                )

        except Exception as e:
            print(
                f"Presentation Parsing Error for "
                f"document {document.id}: {e}"
            )

    if not context_parts:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract text from the selected documents.",
        )

    context = "\n\n".join(context_parts)

    try:
        presentation = presentation_service.generate_slides(
            context=context
        )

    except Exception as e:
        print(
            f"Presentation Generation Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate research presentation.",
        )

    return {
        "message": "Research presentation generated successfully",
        "presentation": presentation,
        "documents_used": [
            {
                "id": document.id,
                "filename": document.original_filename,
            }
            for document in documents
        ],
    }


# ======================================================
# Semantic Search Across All Projects
# ======================================================

@router.post("/semantic-search")
def semantic_search_documents(
    query_text: str = Query(...),
    top_k: int = Query(10, ge=1, le=50),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    documents = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
        .all()
    )

    if not documents:
        raise HTTPException(
            status_code=404,
            detail="No documents found.",
        )

    document_ids = [
        document.id
        for document in documents
    ]

    try:
        results = chroma_service.search(
            query=query_text,
            top_k=top_k,
            document_ids=document_ids,
        )

    except Exception as e:
        print(
            f"Semantic Search Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Semantic search failed.",
        )

    search_results = []

    result_documents = results.get(
        "documents",
        [],
    )

    result_metadatas = results.get(
        "metadatas",
        [],
    )

    result_distances = results.get(
        "distances",
        [],
    )

    if result_documents:
        chunks = result_documents[0]

        metadata_list = (
            result_metadatas[0]
            if result_metadatas
            else []
        )

        distance_list = (
            result_distances[0]
            if result_distances
            else []
        )

        for index, chunk in enumerate(chunks):

            metadata = (
                metadata_list[index]
                if index < len(metadata_list)
                else {}
            )

            distance = (
                distance_list[index]
                if index < len(distance_list)
                else None
            )

            search_results.append(
                {
                    "filename": metadata.get(
                        "filename",
                        "Unknown Document",
                    ),
                    "document_id": metadata.get(
                        "document_id"
                    ),
                    "chunk": chunk,
                    "distance": distance,
                }
            )

    return {
        "message": "Semantic search completed successfully",
        "query": query_text,
        "results": search_results,
    }


# ======================================================
# AI Research Question Generation
# ======================================================

@router.post("/research-questions")
def generate_research_questions(
    document_ids: Optional[List[int]] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
    )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        query = query.filter(
            Document.project_id == project_id
        )

    if document_ids:
        query = query.filter(
            Document.id.in_(document_ids)
        )

    documents = query.all()

    if not documents:
        raise HTTPException(
            status_code=404,
            detail="No documents found.",
        )

    context_parts = []

    for document in documents:

        if not os.path.exists(document.file_path):
            continue

        try:
            text = DocumentParser.parse(
                document.file_path
            )

            if text and text.strip():
                context_parts.append(
                    f"""
DOCUMENT: {document.original_filename}

{text}
"""
                )

        except Exception as e:
            print(
                f"Research Question Parsing Error for "
                f"document {document.id}: {e}"
            )

    if not context_parts:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract text from the selected documents.",
        )

    context = "\n\n".join(context_parts)

    try:
        questions = research_question_service.generate_questions(
            context=context
        )

    except Exception as e:
        print(
            f"Research Question Generation Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate research questions.",
        )

    return {
        "message": "Research questions generated successfully",
        "research_questions": questions,
        "documents_used": [
            {
                "id": document.id,
                "filename": document.original_filename,
            }
            for document in documents
        ],
    }


# ======================================================
# AI Research Methodology Generation
# ======================================================

@router.post("/research-methodology")
def generate_research_methodology(
    document_ids: Optional[List[int]] = Query(None),
    project_id: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = (
        db.query(Document)
        .filter(
            Document.user_id == current_user.id
        )
    )

    if project_id is not None:
        project = (
            db.query(Project)
            .filter(
                Project.id == project_id,
                Project.user_id == current_user.id,
            )
            .first()
        )

        if not project:
            raise HTTPException(
                status_code=404,
                detail="Project not found.",
            )

        query = query.filter(
            Document.project_id == project_id
        )

    if document_ids:
        query = query.filter(
            Document.id.in_(document_ids)
        )

    documents = query.all()

    if not documents:
        raise HTTPException(
            status_code=404,
            detail="No documents found.",
        )

    context_parts = []

    for document in documents:

        if not os.path.exists(document.file_path):
            continue

        try:
            text = DocumentParser.parse(
                document.file_path
            )

            if text and text.strip():
                context_parts.append(
                    f"""
DOCUMENT: {document.original_filename}

{text}
"""
                )

        except Exception as e:
            print(
                f"Research Methodology Parsing Error "
                f"for document {document.id}: {e}"
            )

    if not context_parts:
        raise HTTPException(
            status_code=400,
            detail="Unable to extract text from the selected documents.",
        )

    context = "\n\n".join(context_parts)

    try:
        methodology = (
            research_methodology_service
            .generate_methodology(
                context=context
            )
        )

    except Exception as e:
        print(
            f"Research Methodology Generation Error: {e}"
        )

        raise HTTPException(
            status_code=500,
            detail="Failed to generate research methodology.",
        )

    return {
        "message": "Research methodology generated successfully",
        "research_methodology": methodology,
        "documents_used": [
            {
                "id": document.id,
                "filename": document.original_filename,
            }
            for document in documents
        ],
    }