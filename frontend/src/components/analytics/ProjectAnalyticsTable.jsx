export default function ProjectAnalyticsTable({ projects = [] }) {
  return (
    <section className="analytics-section">
      <h2>Project Analytics</h2>

      <div className="analytics-table-wrapper">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Documents</th>
              <th>Chats</th>
              <th>Research Notes</th>
              <th>Activity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {projects.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No projects found.
                </td>
              </tr>
            ) : (
              projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.name}</td>
                  <td>{project.documents}</td>
                  <td>{project.chats}</td>
                  <td>{project.notes}</td>
                  <td>{project.activity}</td>
                  <td>{project.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}