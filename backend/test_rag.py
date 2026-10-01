from services.rag_service import rag_service

question = input("Ask a question: ")

result = rag_service.ask(question)

print("\n" + "=" * 60)
print("AI ANSWER")
print("=" * 60)
print(result["answer"])

print("\n" + "=" * 60)
print("RETRIEVED CONTEXT")
print("=" * 60)

for i, chunk in enumerate(result["context"], start=1):
    print(f"\nChunk {i}")
    print("-" * 40)
    print(chunk)