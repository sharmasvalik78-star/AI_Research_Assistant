import ResearchNoteCard from "./ResearchNoteCard";
import ResearchEmptyState from "./ResearchEmptyState";

export default function ResearchNotesGrid({
  notes,
  emptyStateProps,
  onView,
  onFavorite,
  onDelete,
}) {
  if (notes.length === 0) {
    return (
      <ResearchEmptyState
        {...emptyStateProps}
      />
    );
  }

  return (
    <div className="workspace-notes-grid">
      {notes.map((note) => (
        <ResearchNoteCard
          key={note.id}
          note={note}
          onView={onView}
          onFavorite={onFavorite}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}