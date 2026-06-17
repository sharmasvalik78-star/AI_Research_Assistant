from fastapi import APIRouter
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

router = APIRouter()

class CodeRequest(BaseModel):
    prompt: str

@router.post("/generate")
def generate_code(request: CodeRequest):

    response = model.generate_content(
        f"""
Generate only code.
No explanation.

Task:
{request.prompt}
"""
    )

    return {
        "code": response.text
    }