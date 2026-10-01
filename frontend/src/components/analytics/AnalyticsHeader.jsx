import { Calendar, Download } from "lucide-react";

export default function AnalyticsHeader({ onRangeChange, analytics }) {
  return (
    <section className="analytics-header">
      <div className="analytics-header-left">
        <span className="analytics-badge">
          📊 Analytics Dashboard
        </span>

        <h1>Research Analytics</h1>

        <p>
          Monitor research performance, AI usage, document growth,
          and project insights from one centralized dashboard.
        </p>
      </div>

      <div className="analytics-header-right">
        <div className="analytics-filter">
          <Calendar size={18} />

          <select defaultValue="30" onChange={(e) => onRangeChange(Number(e.target.value))}>
            <option value="today">Today</option>
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
          </select>
        </div>

        <button
          className="analytics-export-btn"
          onClick={() => {
            const data = JSON.stringify(analytics, null, 2);
            const blob = new Blob([data], {
              type: "application/json",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = "research-analytics.json";
            link.click();

            URL.revokeObjectURL(url);
          }}
        >
          <Download size={18} />
          Export
        </button>
      </div>
    </section>
  );
}