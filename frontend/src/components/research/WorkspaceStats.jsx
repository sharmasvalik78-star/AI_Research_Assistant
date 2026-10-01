export default function WorkspaceStats({
  totalNotes,
  favoriteCount,
  filteredCount,
}) {
  return (
    <div className="workspace-stats">
      <div className="workspace-stat-card">
        <h2>{totalNotes}</h2>
        <span>Total Notes</span>
      </div>

      <div className="workspace-stat-card">
        <h2>{favoriteCount}</h2>
        <span>Favorites</span>
      </div>

      <div className="workspace-stat-card">
        <h2>{filteredCount}</h2>
        <span>Showing</span>
      </div>
    </div>
  );
}