from fastapi import APIRouter
from services.rag_service import search_document
from services.gemini_service import model

router = APIRouter()

@router.post("/generate")
def generate_viva():

    context = "\n".join(
        search_document(
            "Generate viva questions from uploaded PDF"
        )
    )

    prompt = f"""
Based on the following PDF:

{context}

Generate 10 viva questions with answers.

Format:

Q1:
A1:

Q2:
A2:
"""

    response = model.generate_content(
        prompt
    )

    return {
        "viva": response.text
    }