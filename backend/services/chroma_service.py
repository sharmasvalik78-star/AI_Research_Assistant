import chromadb
from typing import List, Optional

CHROMA_PATH = "./chroma_db_new"

client = chromadb.PersistentClient(path=CHROMA_PATH)
collection = client.get_or_create_collection(name="documents")


class ChromaService:
    def add_document_chunks(
        self,
        document_id: int,
        chunks: List[str],
        filename: Optional[str] = None,
    ):
        ids = []
        documents = []
        metadatas = []

        for index, chunk in enumerate(chunks):
            ids.append(f"{document_id}_{index}")
            documents.append(chunk)

            metadata = {
                "document_id": document_id,
                "chunk_index": index,
            }

            if filename:
                metadata["filename"] = filename

            metadatas.append(metadata)

        collection.add(
            ids=ids,
            documents=documents,
            metadatas=metadatas,
        )

    def search(
        self,
        query: str,
        top_k: int = 5,
        document_id: Optional[int] = None,
        document_ids: Optional[List[int]] = None,
    ):
        if document_ids:
            results = collection.query(
                query_texts=[query],
                n_results=top_k,
                where={
                    "document_id": {
                        "$in": document_ids
                    }
                },
            )

        elif document_id is not None:
            results = collection.query(
                query_texts=[query],
                n_results=top_k,
                where={
                    "document_id": document_id,
                },
            )

        else:
            results = collection.query(
                query_texts=[query],
                n_results=top_k,
            )

        return results

    def delete_document(
        self,
        document_id: int,
    ):
        collection.delete(
            where={
                "document_id": document_id,
            }
        )


chroma_service = ChromaService()