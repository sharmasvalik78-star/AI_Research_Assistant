from pathlib import Path
import fitz  # PyMuPDF
from docx import Document as DocxDocument


class DocumentParser:
    """
    Production-ready document parser.

    Supports:
    - PDF
    - DOCX
    - TXT
    """

    @staticmethod
    def parse(file_path: str) -> str:
        extension = Path(file_path).suffix.lower()

        if extension == ".pdf":
            return DocumentParser._parse_pdf(file_path)

        elif extension == ".docx":
            return DocumentParser._parse_docx(file_path)

        elif extension == ".txt":
            return DocumentParser._parse_txt(file_path)

        raise ValueError(f"Unsupported file type: {extension}")

    @staticmethod
    def _parse_pdf(file_path: str) -> str:
        document = fitz.open(file_path)

        text = ""

        for page in document:
            text += page.get_text()

        document.close()

        return text.strip()

    @staticmethod
    def _parse_docx(file_path: str) -> str:
        document = DocxDocument(file_path)

        paragraphs = [
            paragraph.text
            for paragraph in document.paragraphs
        ]

        return "\n".join(paragraphs).strip()

    @staticmethod
    def _parse_txt(file_path: str) -> str:
        with open(
            file_path,
            "r",
            encoding="utf-8",
            errors="ignore",
        ) as file:
            return file.read().strip()