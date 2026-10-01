import {
  FolderKanban,
  FileText,
  MessageSquare,
  NotebookPen,
  TrendingUp,
  Brain,
} from "lucide-react";

export default function ResearchInsights({
  insights,
  currentStreak,
  longestStreak,
  mostActiveDay,
  activitySummary,
}) {
  const cards = [
    {
      title: "Most Active Project",
      value: insights?.most_active_project || "No Projects",
      description: "Project with the highest activity.",
      icon: FolderKanban,
      color: "blue",
    },
    {
      title: "Documents Indexed",
      value: insights?.documents ?? 0,
      description: "Documents currently available for AI research.",
      icon: FileText,
      color: "green",
    },
    {
      title: "AI Questions",
      value: insights?.questions ?? 0,
      description: "Questions processed by the AI assistant.",
      icon: MessageSquare,
      color: "purple",
    },
    {
      title: "Research Notes",
      value: insights?.notes ?? 0,
      description: "Saved research notes across all projects.",
      icon: NotebookPen,
      color: "orange",
    },
    {
      title: "Research Growth",
      value: "Growing",
      description: "Your research activity is increasing steadily.",
      icon: TrendingUp,
      color: "cyan",
    },
    {
      title: "AI Performance",
      value: "Excellent",
      description: "Current AI system health and response quality.",
      icon: Brain,
      color: "pink",
    },

    // New Activity Analytics
    {
      title: "Current Streak",
      value: currentStreak ?? 0,
      description: "Consecutive active research days.",
      icon: TrendingUp,
      color: "green",
    },
    {
      title: "Longest Streak",
      value: longestStreak ?? 0,
      description: "Best consecutive research streak.",
      icon: Brain,
      color: "purple",
    },
   {
    title: "Most Active Day",
    value: mostActiveDay
        ? `${mostActiveDay.date} (${mostActiveDay.count})`
        : "N/A",
    description: "Day with the highest research activity.",
    icon: MessageSquare,
    color: "blue",
    },
    {
    title: "Activity Summary",
    value: activitySummary
        ? `${activitySummary.total_questions} questions in ${activitySummary.active_days} active days`
        : "No activity",
    description: "Overall research activity summary.",
    icon: NotebookPen,
    color: "orange",
    },
  ];

  return (
    <section className="analytics-section">
      <h2>Research Insights</h2>

      <div className="research-insights-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`research-insight-card ${card.color}`}
            >
              <div className="research-insight-icon">
                <Icon size={28} />
              </div>

              <h3>{card.title}</h3>

              <h4>{card.value}</h4>

              <p>{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}