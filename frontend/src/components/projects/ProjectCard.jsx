import "./ProjectCard.css";

export default function ProjectCard({
  project,
  onOpen,
  onRename,
  onDelete,
}) {
  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-icon">📁</div>

        <div className="project-header-content">
          <h2 className="project-title">{project.name}</h2>

          <span className="project-badge">
            Research Project
          </span>
        </div>
      </div>

      <p className="project-description">
        {project.description || "No description provided for this project."}
      </p>

      <div className="project-divider" />

      <div className="project-date">
        <span>📅</span>

        <span>
          Created {new Date(project.created_at).toLocaleDateString()}
        </span>
      </div>

      <div className="project-actions">
        <button
          className="project-btn project-open focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => onOpen(project)}
        >
          Open
        </button>

        <button
          className="project-btn project-rename focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
          onClick={() => onRename(project)}
        >
          Rename
        </button>

        <button
          className="project-btn project-delete focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => onDelete(project)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}