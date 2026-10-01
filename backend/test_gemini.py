from services.gemini_service import gemini_service

context = """
Machine Learning is a subset of Artificial Intelligence.

Deep Learning uses neural networks.
"""

question = "What is Machine Learning?"

answer = gemini_service.generate_answer(
    context=context,
    question=question,
)

print("\nGemini Answer:\n")
print(answer)