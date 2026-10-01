import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDashboardStats } from "../services/dashboardService";

import "./Dashboard.css";

export default function Dashboard() {
  const [stats, setStats] = useState({
    documents: 0,
    chats: 0,
    notes: 0,
    favorites: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
  const fetchDashboard = async () => {
    try {
      const data = await getDashboardStats();

      setStats(data.stats);
      setRecentActivity(data.recent_activity || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  function getActivityDetails(type) {
    switch (type) {
      case "document":
        return {
          icon: "📄",
          label: "Uploaded document",
          badgeClass: "activity-badge document",
        };

      case "note":
        return {
          icon: "📝",
          label: "Saved research note",
          badgeClass: "activity-badge note",
        };

      case "chat":
        return {
          icon: "💬",
          label: "Updated chat",
          badgeClass: "activity-badge chat",
        };

      default:
        return {
          icon: "📌",
          label: "Activity",
          badgeClass: "activity-badge",
        };
    }
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
  <span
    style={{
      display: "inline-block",
      padding: "6px 14px",
      marginBottom: "16px",
      borderRadius: "999px",
      background: "rgba(255,255,255,0.18)",
      fontSize: "13px",
      fontWeight: 600,
    }}
  >
    ✨ AI Workspace
  </span>

  <h1>🚀 AI Research Assistant Pro</h1>

  <p>
    Welcome back! Here's an overview of your research workspace.
  </p>

  <div
    style={{
      marginTop: "20px",
      color: "rgba(255,255,255,.92)",
      fontSize: "14px",
      fontWeight: 500,
    }}
  >
    {new Date().toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}
  </div>
</div>

      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h2>📄 Documents</h2>
          <h1>{stats.documents}</h1>
        </div>

        <div className="dashboard-card">
          <h2>💬 Research Chats</h2>
          <h1>{stats.chats}</h1>
        </div>

        <div className="dashboard-card">
          <h2>📝 Research Notes</h2>
          <h1>{stats.notes}</h1>
        </div>

        <div className="dashboard-card">
          <h2>⭐ Favorite Notes</h2>
          <h1>{stats.favorites}</h1>
        </div>
      </div>

      <div className="dashboard-quick-actions">
  <button
    className="quick-action-card"
    onClick={() => navigate("/upload")}
  >
    <span>📤</span>
    <h3>Upload Document</h3>
    <p>Add a new research document.</p>
  </button>

  <button
    className="quick-action-card focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    onClick={() => navigate("/chat")}
  >
    <span>💬</span>
    <h3>Research Chat</h3>
    <p>Start an AI research conversation.</p>
  </button>

  <button
    className="quick-action-card focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    onClick={() => navigate("/projects")}
  >
    <span>📁</span>
    <h3>Projects</h3>
    <p>Open your research projects.</p>
  </button>

  <button
    className="quick-action-card focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    onClick={() => navigate("/research-notes")}
  >
    <span>📝</span>
    <h3>Research Notes</h3>
    <p>Browse your saved notes.</p>
  </button>
</div>

      <div className="dashboard-section">
        <h2>🕒 Recent Activity</h2>

        {recentActivity.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          <div className="recent-activity-list">
            {recentActivity.map((activity, index) => {
              const details = getActivityDetails(activity.type);

              return (
                <div
                  key={index}
                  className="recent-activity-item"
                >
                  <div className="activity-left">
                    <div className="activity-icon">
                      {details.icon}
                    </div>

                    <div>
                      <span className={details.badgeClass}>
                        {details.label}
                      </span>

                      <strong>{activity.title}</strong>
                    </div>
                  </div>

                  <div className="activity-time">
                    {new Date(activity.timestamp).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}