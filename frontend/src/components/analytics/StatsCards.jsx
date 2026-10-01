import {
  FolderKanban,
  FileText,
  MessageSquare,
  NotebookPen,
  Brain,
  Clock3,
} from "lucide-react";

export default function StatsCards({ statistics }) {
  const stats = [
    {
      title: "Projects",
      value: statistics?.projects ?? 0,
      icon: FolderKanban,
      color: "blue",
    },
    {
      title: "Documents",
      value: statistics?.documents ?? 0,
      icon: FileText,
      color: "green",
    },
    {
      title: "Chats",
      value: statistics?.chats ?? 0,
      icon: MessageSquare,
      color: "purple",
    },
    {
      title: "Research Notes",
      value: statistics?.research_notes ?? 0,
      icon: NotebookPen,
      color: "orange",
    },
    {
      title: "AI Questions",
      value: statistics?.ai_questions ?? 0,
      icon: Brain,
      color: "pink",
    },
    {
      title: "Avg Response",
      value: `${statistics?.average_response_time ?? 0}s`,
      icon: Clock3,
      color: "cyan",
    },
  ];

  return (
    <section className="analytics-section">
      <h2>Overview</h2>

      <div className="analytics-stats-grid">
        {stats.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`analytics-stat-card ${item.color}`}
            >
              <div className="analytics-stat-icon">
                <Icon size={26} />
              </div>

              <div className="analytics-stat-content">
                <span>{item.title}</span>

                <h3>{item.value}</h3>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}