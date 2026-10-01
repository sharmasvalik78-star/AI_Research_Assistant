import { lazy, Suspense, useEffect, useState } from "react";

import AnalyticsHeader from "../components/analytics/AnalyticsHeader";
import StatsCards from "../components/analytics/StatsCards";
import ProjectAnalyticsTable from "../components/analytics/ProjectAnalyticsTable";
import AIUsageCards from "../components/analytics/AIUsageCards";
import ResearchInsights from "../components/analytics/ResearchInsights";
import ActivityHeatmap from "../components/analytics/ActivityHeatmap";

const AnalyticsCharts = lazy(
  () => import("../components/analytics/AnalyticsCharts")
);

import { getAnalyticsOverview } from "../services/analyticsService";

import "../styles/analytics.css";

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

useEffect(() => {
  const fetchAnalytics = async () => {
    try {
      const data = await getAnalyticsOverview(days);
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to load analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchAnalytics();
}, [days]);

  if (loading) {
    return (
      <div className="analytics-page">
        <h2>Loading analytics...</h2>
      </div>
    );
  }

  return (
    <div className="analytics-page">
      <AnalyticsHeader
        analytics={analytics}
        onRangeChange={(selectedDays) => setDays(selectedDays)}
      />

      <StatsCards statistics={analytics?.statistics} />

      <Suspense fallback={<div>Loading charts...</div>}>
        <AnalyticsCharts
          charts={analytics?.charts}
        />
      </Suspense>

      <ProjectAnalyticsTable
      projects={analytics?.projects || []}
    />

      <AIUsageCards
      aiUsage={analytics?.ai_usage}
    />

      <ResearchInsights
        insights={analytics?.insights}
        currentStreak={analytics?.current_streak}
        longestStreak={analytics?.longest_streak}
        mostActiveDay={analytics?.most_active_day}
        activitySummary={analytics?.activity_summary}
      />

      <ActivityHeatmap
        heatmap={analytics?.heatmap || []}
      />
    </div>
  );
}