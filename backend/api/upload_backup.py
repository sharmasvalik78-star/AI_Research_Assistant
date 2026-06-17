import os

from fastapi import APIRouter
from fastapi import UploadFile
from fastapi import File
from fastapi import HTTPException

from services.pdf_service import extract_text_from_pdf
from services.docx_service import extract_text_from_docx
from services.rag_service import add_document

router = APIRouter()

UPLOAD_DIR = "uploads/files"

os.makedirs(
    UPLOAD_DIR,
    exist_ok=True
)

@router.post("/")
async def upload_file(
    file: UploadFile = File(...)
):
    try:
        file_path = os.path.join(
            UPLOAD_DIR,
            file.filename
        )

        with open(file_path, "wb") as buffer:
            buffer.write(
                await file.read()
            )

        ext = file.filename.split(".")[-1].lower()

        if ext == "pdf":
            text = extract_text_from_pdf(
                file_path
            )

        elif ext == "docx":
            text = extract_text_from_docx(
                file_path
            )

        else:
            raise HTTPException(
                status_code=400,
                detail="Only PDF and DOCX files are supported"
            )

        add_document(
            text=text,
            doc_id=file.filename
        )

        return {
            "filename": file.filename,
            "characters": len(text),
            "status": "Indexed in ChromaDB"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )