from typing import List

from core.config import GEMINI_MODEL
from services.rag_service import RAGService
from services.gemini_service import gemini_service


class DocumentComparisonService:
    """
    AI-powered comparison service for two or more research documents.
    """

    @staticmethod
    def compare_documents(
        document_ids: List[int],
        question: str = "",
        top_k: int = 12,
    ) -> dict:

        if len(document_ids) < 2:
            raise ValueError(
                "At least two documents are required for comparison."
            )

        comparison_question = question.strip()

        if not comparison_question:
            comparison_question = (
                "Compare the provided documents and identify their "
                "key similarities, differences, findings, agreements, "
                "contradictions, and important insights."
            )

        context_items = RAGService.retrieve_context(
            query=comparison_question,
            document_ids=document_ids,
            top_k=top_k,
        )

        if not context_items:
            return {
                "answer": (
                    "I couldn't find enough information in the selected "
                    "documents to perform the comparison."
                ),
                "context": [],
            }

        document_sections = []

        for item in context_items:
            document_sections.append(
                f"DOCUMENT: {item['filename']}\n\n"
                f"{item['chunk']}"
            )

        comparison_context = "\n\n---\n\n".join(
            document_sections
        )

        prompt = f"""
# ROLE

You are an AI Research Assistant specializing in document comparison.

Compare ONLY the information contained in the provided document context.

Do not invent facts.
Do not use outside knowledge.
Clearly distinguish information belonging to different documents.

# COMPARISON REQUIREMENTS

Analyze the documents and provide:

## 1. Overall Comparison

Give a concise overview of what the documents have in common
and where they differ.

## 2. Key Similarities

Identify the most important concepts, findings, arguments,
or conclusions shared by the documents.

## 3. Key Differences

Identify important differences in findings, approaches,
methodology, arguments, or conclusions.

## 4. Agreements

Explain areas where the documents support similar conclusions.

## 5. Contradictions

Identify claims or conclusions that appear to conflict.

## 6. Important Insights

Highlight useful research insights that become clear
when comparing the documents.

## 7. Document-by-Document Summary

Briefly summarize the main contribution of each document.

Use GitHub Flavored Markdown.

Use headings, bullet lists, and tables when they improve clarity.

Always identify the document filename when attributing information.

If the provided context does not contain enough information
for a specific comparison, say so instead of guessing.

---

## DOCUMENT CONTEXT

{comparison_context}

---

## COMPARISON QUESTION

{comparison_question}
"""

        response = gemini_service.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return {
            "answer": response.text.strip(),
            "context": [
                {
                    "filename": item["filename"],
                }
                for item in context_items
            ],
        }


document_comparison_service = DocumentComparisonService()