import { Link } from "react-router-dom";

import "./ResearchEmptyState.css";

export default function ResearchEmptyState({
  icon = "📚",
  title = "No Research Notes Yet",
  description =
    "Your saved AI research notes will appear here. Create notes from your research chat to build your personal knowledge base.",
  showButton = true,
  buttonText = "🚀 Start Research",
  buttonLink = "/chat",
}) {
  return (
    <div className="research-empty-state">
      <div className="empty-state-icon">
        {icon}
      </div>

      <h2 className="empty-state-title">
        {title}
      </h2>

      <p className="empty-state-description">
        {description}
      </p>

      {showButton && (
        <Link
          to={buttonLink}
          className="empty-state-button"
        >
          {buttonText}
        </Link>
      )}
    </div>
  );
}