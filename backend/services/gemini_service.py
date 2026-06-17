import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

print("Loaded API Key:", os.getenv("GEMINI_API_KEY")[:15])

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def generate_answer(
    context,
    question
):
    prompt = f"""
You are an AI Research Assistant.

Answer ONLY from the given PDF context.

Context:
{context}

Question:
{question}

Answer:
"""

    response = model.generate_content(
        prompt
    )

    return response.text
