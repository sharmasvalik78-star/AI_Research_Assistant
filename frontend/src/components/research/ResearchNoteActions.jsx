import "./ResearchNoteActions.css";

export default function ResearchNoteActions({
  note,
  onView,
  onFavorite,
  onDelete,
}) {
  return (
    <div className="note-footer">
      <button
        className="note-action-btn"
        onClick={() => onView(note)}
      >
        👁 View
      </button>

      <button
        className={`note-action-btn favorite-btn ${
          note.is_favorite ? "active" : ""
        }`}
        onClick={() => onFavorite(note)}
      >
        <span className="favorite-icon">
          {note.is_favorite ? "⭐" : "☆"}
        </span>

        <span>
          {note.is_favorite
            ? "Unfavorite"
            : "Favorite"}
        </span>
      </button>

      <button
        className="note-action-btn delete-btn"
        onClick={() => onDelete(note)}
      >
        🗑 Delete
      </button>
    </div>
  );
}