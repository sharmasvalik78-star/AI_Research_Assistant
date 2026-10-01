from google import genai

from core.config import (
    GEMINI_API_KEY,
    GEMINI_MODEL,
)


class ResearchMethodologyService:
    """
    Generates a structured research methodology
    from uploaded research document context.
    """

    def __init__(self):
        self.client = genai.Client(
            api_key=GEMINI_API_KEY
        )

    def generate_methodology(
        self,
        context: str,
    ) -> str:

        prompt = f"""
# ROLE

You are an AI Research Assistant specialized in
academic research methodology analysis.

Analyze ONLY the provided research document context.

Extract and organize the methodology actually described
in the documents.

# RULES

- Use ONLY information present in the documents.
- Do NOT invent research methods, datasets, algorithms,
  tools, experiments, or evaluation techniques.
- Clearly distinguish documented methodology from
  information that is not specified.
- Preserve the terminology used in the documents.
- Identify the source document when possible.
- Keep the methodology academically structured.
- Do not assume a methodology simply because a technology
  or tool is mentioned.
- Use GitHub Flavored Markdown.

# RESPONSE FORMAT

## Research Methodology

### 1. Research Approach

Describe the research approach or development approach
explicitly supported by the documents.

### 2. Problem Definition

Describe the problem being addressed.

### 3. Objectives

List the research or project objectives described
in the documents.

### 4. Data / Information Sources

Describe the datasets, documents, users, information
sources, or other inputs explicitly mentioned.

### 5. Data Collection

Describe how data or information was collected,
if specified.

### 6. Data Preprocessing

Describe preprocessing, cleaning, transformation,
or preparation steps, if specified.

### 7. Methods and Techniques

List the research methods, algorithms, models,
architectures, or techniques explicitly described.

### 8. System Architecture / Workflow

Describe the architecture, components, layers,
or workflow used in the research.

### 9. Tools and Technologies

List the technologies, frameworks, platforms,
databases, and tools explicitly mentioned.

### 10. Evaluation and Validation

Describe how the system, method, or results
were evaluated or validated, if specified.

### 11. Limitations

List methodology-related limitations explicitly
mentioned in the documents.

### 12. Overall Methodology Summary

Provide a concise summary of the methodology
supported by the documents.

If information for any section is not available,
write:

"No information available in the provided documents."

# DOCUMENT CONTEXT

{context}
"""

        response = self.client.models.generate_content(
            model=GEMINI_MODEL,
            contents=prompt,
        )

        return response.text.strip()


research_methodology_service = ResearchMethodologyService()