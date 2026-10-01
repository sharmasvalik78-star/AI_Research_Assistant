import ResearchNoteActions from "./ResearchNoteActions";
import ResearchTags from "./ResearchTags";

import "./ResearchNoteCard.css";

export default function ResearchNoteCard({
  note,
  onView,
  onFavorite,
  onDelete,
}) {
  // Remove markdown formatting for a cleaner preview
  const plainText = (note.answer || "")
    .replace(/```[\s\S]*?```/g, "[Code Block]")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[.*?\]\(.*?\)/g, "")
    .replace(/\[([^\]]+)\]\((.*?)\)/g, "$1")
    .replace(/[#>*-]/g, "")
    .replace(/\n+/g, " ")
    .trim();

  const preview =
    plainText.length > 220
      ? plainText.substring(0, 220) + "..."
      : plainText;

  return (
    <div className="research-note-card">
      <div className="note-top">
        <div className="note-title-section">
          <h3>{note.title}</h3>

          <div className="note-meta">
            <span className="note-tag">
              AI Research
            </span>

            {note.is_favorite && (
              <span className="favorite-badge">
                ⭐ Favorite
              </span>
            )}
          </div>

          <ResearchTags tags={note.tags} />
        </div>
      </div>

      <div className="note-section">
        <div className="section-label">
          Research Question
        </div>

        <p className="note-question">
          {note.question}
        </p>
      </div>

      <div className="note-section">
        <div className="section-label">
          AI Answer Preview
        </div>

        <div className="note-preview">
          {preview}
        </div>
      </div>

      <ResearchNoteActions
        note={note}
        onView={onView}
        onFavorite={onFavorite}
        onDelete={onDelete}
      />
    </div>
  );
}