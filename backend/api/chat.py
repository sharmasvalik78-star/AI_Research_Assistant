from fastapi import APIRouter
from schemas.chat_schema import ChatRequest

from services.rag_service import (
    search_document
)

from services.gemini_service import (
    generate_answer
)

router = APIRouter()

@router.post("/")
def chat(request: ChatRequest):
    try:
        print("=" * 50)
        print("QUESTION:", request.question)

        context_chunks = search_document(
            request.question
        )

        print("CONTEXT CHUNKS:", context_chunks)

        context = "\n".join(context_chunks)

        answer = generate_answer(
            context,
            request.question
        )

        print("ANSWER GENERATED")

        return {
            "answer": answer
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return {
            "error": str(e)
        }
