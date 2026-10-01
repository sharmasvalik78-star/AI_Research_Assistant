export function exportResearchNoteMarkdown(note) {
  const markdown = `# ${note.title}

## Research Question

${note.question}

## AI Answer

${note.answer}
`;

  const blob = new Blob([markdown], {
    type: "text/markdown;charset=utf-8",
  });

  downloadBlob(
    blob,
    `${sanitizeFilename(note.title)}.md`
  );
}

export async function exportResearchNoteWord(note) {
  const {
    Document,
    Packer,
    Paragraph,
    HeadingLevel,
    TextRun,
  } = await import("docx");

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun({
                text: note.title,
                bold: true,
              }),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Research Question",
          }),

          new Paragraph({
            children: [
              new TextRun(note.question),
            ],
          }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "AI Answer",
          }),

          new Paragraph({
            children: [
              new TextRun(note.answer),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  downloadBlob(
    blob,
    `${sanitizeFilename(note.title)}.docx`
  );
}

export async function exportResearchNotePDF(note) {
  const { jsPDF } = await import("jspdf");

  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;

  let y = 20;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.text(note.title, margin, y);

  y += 15;

  pdf.setFontSize(14);
  pdf.text("Research Question", margin, y);

  y += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);

  const questionLines = pdf.splitTextToSize(
    note.question,
    maxWidth
  );

  pdf.text(questionLines, margin, y);

  y += questionLines.length * 7 + 10;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.text("AI Answer", margin, y);

  y += 8;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(12);

  const answerLines = pdf.splitTextToSize(
    note.answer,
    maxWidth
  );

  pdf.text(answerLines, margin, y);

  pdf.save(
    `${sanitizeFilename(note.title)}.pdf`
  );
}

function sanitizeFilename(name) {
  return (
    name
      .replace(/[<>:"/\\|?*]+/g, "_")
      .trim() || "research-note"
  );
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}