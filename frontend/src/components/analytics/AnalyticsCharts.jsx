import { useEffect, useState } from "react";

export default function AnalyticsCharts({ charts }) {
  const [Recharts, setRecharts] = useState(null);

  const monthlyData = charts?.monthly || [];

  useEffect(() => {
    let mounted = true;

    import("recharts").then((module) => {
      if (mounted) {
        setRecharts(module);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!Recharts) {
    return (
      <section className="analytics-section">
        <h2>Analytics Overview</h2>

        <div className="analytics-chart-grid">
          <div className="chart-card">
            <h3>📈 Monthly Activity</h3>
            <div style={{ height: "360px" }} />
          </div>
        </div>
      </section>
    );
  }

  const {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
  } = Recharts;

  return (
    <section className="analytics-section">
      <h2>Analytics Overview</h2>

      <div className="analytics-chart-grid">
        <div className="chart-card">
          <h3>📈 Monthly Activity</h3>

          <ResponsiveContainer
            width="100%"
            height={360}
          >
            <BarChart
              data={monthlyData}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="month"
                tick={{ fontSize: 13 }}
              />

              <YAxis
                tick={{ fontSize: 13 }}
              />

              <Tooltip />

              <Legend />

              <Bar
                dataKey="projects"
                name="Projects"
                fill="#2563eb"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="documents"
                name="Documents"
                fill="#16a34a"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="chats"
                name="Chats"
                fill="#ea580c"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="notes"
                name="Research Notes"
                fill="#7c3aed"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}