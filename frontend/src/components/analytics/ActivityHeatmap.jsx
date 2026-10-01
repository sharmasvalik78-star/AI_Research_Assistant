export default function ActivityHeatmap({ heatmap = [] }) {
  const getLevel = (count) => {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 10) return 3;
    return 4;
  };

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const cells =
    heatmap.length > 0
      ? heatmap.map((item) => ({
          ...item,
          level: getLevel(item.count),
          dateObject: new Date(item.date),
        }))
      : Array.from({ length: 84 }, (_, index) => ({
          id: index,
          date: "",
          count: 0,
          level: 0,
          dateObject: new Date(),
        }));

  const weeks = [];

  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  return (
    <section className="analytics-section">
      <h2>Research Activity</h2>

      <p className="heatmap-subtitle">
        GitHub-style AI research activity during the selected period
      </p>

      <div className="github-heatmap">

        <div className="heatmap-months">
          <div className="heatmap-month-spacer" />

          {weeks.map((week, index) => {
            const month =
              week.length > 0
                ? monthNames[week[0].dateObject.getMonth()]
                : "";

            const previous =
              index > 0
                ? monthNames[
                    weeks[index - 1][0].dateObject.getMonth()
                  ]
                : "";

            return (
              <div
                key={index}
                className="heatmap-month"
              >
                {month !== previous ? month : ""}
              </div>
            );
          })}
        </div>

        <div className="heatmap-body">

          <div className="heatmap-days">
            {days.map((day) => (
              <div
                key={day}
                className="heatmap-day"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="heatmap-weeks">
            {weeks.map((week, weekIndex) => (
              <div
                key={weekIndex}
                className="heatmap-week"
              >
                {week.map((cell, dayIndex) => (
                  <div
                    key={cell.date || dayIndex}
                    className={`heatmap-cell level-${cell.level}`}
                    title={`${cell.date} • ${cell.count} message${
                      cell.count === 1 ? "" : "s"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>

        </div>

      </div>

      <div className="heatmap-legend">
        <span>Less</span>

        <div className="heatmap-cell level-0" />
        <div className="heatmap-cell level-1" />
        <div className="heatmap-cell level-2" />
        <div className="heatmap-cell level-3" />
        <div className="heatmap-cell level-4" />

        <span>More</span>
      </div>
    </section>
  );
}