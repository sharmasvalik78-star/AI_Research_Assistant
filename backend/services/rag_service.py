from typing import List, Optional

from services.chroma_service import chroma_service
from services.gemini_service import gemini_service


class RAGService:
    @staticmethod
    def retrieve_context(
        query: str,
        document_id: Optional[int] = None,
        document_ids: Optional[List[int]] = None,
        top_k: int = 5,
    ) -> List[dict]:

        all_results = []

        # ======================================================
        # Multi-document retrieval
        # Retrieve separately from EACH selected document
        # so one document cannot consume all top_k results.
        # ======================================================

        if document_ids:
            number_of_documents = len(document_ids)

            per_document_k = max(
                1,
                top_k // number_of_documents,
            )

            for selected_document_id in document_ids:

                results = chroma_service.search(
                    query=query,
                    top_k=per_document_k,
                    document_id=selected_document_id,
                )

                print(
                    f"Distances for document "
                    f"{selected_document_id}:",
                    results.get("distances"),
                )

                documents = results.get("documents", [])
                metadatas = results.get("metadatas", [])

                if not documents:
                    continue

                document_chunks = documents[0]
                metadata_list = (
                    metadatas[0]
                    if metadatas
                    else []
                )

                for index, chunk in enumerate(document_chunks):

                    metadata = (
                        metadata_list[index]
                        if index < len(metadata_list)
                        else {}
                    )

                    all_results.append(
                        {
                            "filename": metadata.get(
                                "filename",
                                "Unknown Document",
                            ),
                            "chunk": chunk,
                            "document_id": metadata.get(
                                "document_id"
                            ),
                        }
                    )

        # ======================================================
        # Single-document / general retrieval
        # ======================================================

        else:
            results = chroma_service.search(
                query=query,
                top_k=top_k,
                document_id=document_id,
            )

            print(
                "Distances:",
                results.get("distances"),
            )

            documents = results.get("documents", [])
            metadatas = results.get("metadatas", [])

            if documents:
                document_chunks = documents[0]
                metadata_list = (
                    metadatas[0]
                    if metadatas
                    else []
                )

                for index, chunk in enumerate(document_chunks):

                    metadata = (
                        metadata_list[index]
                        if index < len(metadata_list)
                        else {}
                    )

                    all_results.append(
                        {
                            "filename": metadata.get(
                                "filename",
                                "Unknown Document",
                            ),
                            "chunk": chunk,
                            "document_id": metadata.get(
                                "document_id"
                            ),
                        }
                    )

        # ======================================================
        # Remove duplicate chunks
        # ======================================================

        unique_chunks = []
        seen = set()

        for item in all_results:

            normalized = item["chunk"].strip()

            if normalized in seen:
                continue

            seen.add(normalized)

            print(
                "Metadata:",
                item.get("document_id"),
                item.get("filename"),
            )

            unique_chunks.append(
                {
                    "filename": item["filename"],
                    "chunk": item["chunk"],
                }
            )

        print(
            f"Retrieved {len(unique_chunks)} unique chunks "
            f"from {len(document_ids) if document_ids else 1} "
            f"document(s)."
        )

        return unique_chunks

    @staticmethod
    def ask(
        question: str,
        document_id: Optional[int] = None,
        document_ids: Optional[List[int]] = None,
        top_k: int = 5,
    ) -> dict:

        # Backward compatibility
        if document_ids is None and document_id is not None:
            document_ids = [document_id]

        context_items = RAGService.retrieve_context(
            query=question,
            document_id=document_id,
            document_ids=document_ids,
            top_k=top_k,
        )

        print(
            f"Retrieved chunks: {len(context_items)}"
        )

        if not context_items:
            print(
                ">>> USING GENERAL GEMINI <<<"
            )

            answer = gemini_service.generate_general_answer(
                question=question,
            )

            return {
                "answer": answer,
                "context": [],
            }

        print(
            ">>> USING RAG GEMINI <<<"
        )

        # Full text sent ONLY to Gemini
        rag_context = "\n\n".join(
            item["chunk"]
            for item in context_items
        )

        answer = gemini_service.generate_rag_answer(
            context=rag_context,
            question=question,
        )

        # Public citation payload
        citations = [
            {
                "filename": item["filename"],
            }
            for item in context_items
        ]

        return {
            "answer": answer,
            "context": citations,
        }


rag_service = RAGService()