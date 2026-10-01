export default function ResearchLoadingSkeleton() {
  return (
    <div className="research-notes-page">
      <div className="workspace-header">
        <div>
          <h1>📚 Research Workspace</h1>
          <p>Loading your research notes...</p>
        </div>
      </div>

      <div className="workspace-stats">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="workspace-stat-card skeleton-card"
          >
            <div className="skeleton skeleton-number"></div>
            <div className="skeleton skeleton-text"></div>
          </div>
        ))}
      </div>

      <div className="workspace-notes-grid">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            key={item}
            className="research-note-card skeleton-card"
          >
            <div className="skeleton skeleton-title"></div>

            <div className="skeleton skeleton-line"></div>

            <div className="skeleton skeleton-line short"></div>

            <div className="skeleton skeleton-line"></div>

            <div className="note-actions">
              <div className="skeleton skeleton-button"></div>

              <div className="skeleton skeleton-button"></div>

              <div className="skeleton skeleton-button"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}