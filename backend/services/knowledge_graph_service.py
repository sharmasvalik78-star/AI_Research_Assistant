from services.gemini_service import gemini_service
from core.config import GEMINI_MODEL


class KnowledgeGraphService:
    """
    Generates structured knowledge graph data
    from research document context.
    """

    @staticmethod
    def generate_graph(context: str) -> dict:

        prompt = f"""
# ROLE

You are an AI Research Assistant specialized in
research knowledge graph extraction.

Analyze ONLY the provided document context.

Extract the important concepts, technologies, methods,
research topics, findings, and relationships between them.

Return ONLY valid JSON.

# JSON FORMAT

{{
  "nodes": [
    {{
      "id": "unique_id",
      "label": "Concept name",
      "type": "concept"
    }}
  ],
  "edges": [
    {{
      "source": "source_node_id",
      "target": "target_node_id",
      "label": "relationship"
    }}
  ]
}}

# RULES

- Use ONLY information present in the documents.
- Do NOT invent concepts or relationships.
- Every edge source and target must match an existing node id.
- Keep the graph focused on the most important concepts.
- Prefer meaningful research relationships.
- Use short node labels.
- Use relationship labels such as:
  "uses"
  "supports"
  "related_to"
  "improves"
  "evaluates"
  "applied_to"
  "produces"
  "compares"
- Return valid JSON only.
- Do not include Markdown fences.
- Do not include explanations outside the JSON.

# DOCUMENT CONTEXT

{context}
"""

        response = gemini_service.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        text = response.text.strip()

        if text.startswith("```"):
            text = text.replace("```json", "")
            text = text.replace("```", "")
            text = text.strip()

        import json

        graph = json.loads(text)

        return {
            "nodes": graph.get("nodes", []),
            "edges": graph.get("edges", []),
        }


knowledge_graph_service = KnowledgeGraphService()