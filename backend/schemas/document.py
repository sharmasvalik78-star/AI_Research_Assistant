from pydantic import BaseModel
from typing import Literal


class DocumentInsightRequest(BaseModel):
    type: Literal[
        "summary",
        "key_contributions",
        "methodology",
        "main_findings",
        "limitations",
        "future_work",
    ]


class DocumentInsightResponse(BaseModel):
    document_id: int
    document_name: str
    type: str
    content: str