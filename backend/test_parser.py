from services.document_parser import DocumentParser

text = DocumentParser.parse(
    "uploads/5d090fcc-ac57-4874-bc49-1477315ec036.docx"
)

print(text[:1000])