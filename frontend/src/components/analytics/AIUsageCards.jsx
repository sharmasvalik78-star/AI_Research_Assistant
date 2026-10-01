import {
  Brain,
  Coins,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AIUsageCards({ aiUsage }) {
  const cards = [
    {
      title: "AI Requests",
      value: aiUsage?.requests ?? 0,
      description: "Total AI requests processed",
      icon: Brain,
      color: "blue",
    },
    {
      title: "Estimated Tokens",
      value: (aiUsage?.tokens ?? 0).toLocaleString(),
      description: "Approximate tokens consumed",
      icon: Coins,
      color: "purple",
    },
    {
      title: "Estimated Cost",
      value: `$${(aiUsage?.estimated_cost ?? 0).toFixed(2)}`,
      description: "Estimated API usage cost",
      icon: DollarSign,
      color: "green",
    },
    {
      title: "Success Rate",
      value: `${aiUsage?.success_rate ?? 0}%`,
      description: "Successful AI responses",
      icon: CheckCircle2,
      color: "cyan",
    },
    {
      title: "Error Rate",
      value: `${aiUsage?.error_rate ?? 0}%`,
      description: "Failed AI requests",
      icon: AlertTriangle,
      color: "orange",
    },
  ];

  return (
    <section className="analytics-section">
      <h2>AI Usage Analytics</h2>

      <div className="ai-usage-grid">
        {cards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.title}
              className={`ai-usage-card ${card.color}`}
            >
              <div className="ai-card-top">
                <div className="ai-card-icon">
                  <Icon size={26} />
                </div>

                <span>{card.title}</span>
              </div>

              <h3>{card.value}</h3>

              <p>{card.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}