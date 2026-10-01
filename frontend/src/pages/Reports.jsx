import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getProjects } from "../services/projectService";
import { getResearchReport } from "../services/researchReportService";

export default function Reports() {
  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchReports = async () => {
    try {
      setLoading(true);

      const projectData = await getProjects();
      setProjects(projectData);

      const reportResults = await Promise.all(
        projectData.map(async (project) => {
          try {
            const report = await getResearchReport(project.id);

            return {
              project,
              report,
            };
          } catch (error) {
            console.error(
              `Failed to load report for project ${project.id}`,
              error
            );

            return null;
          }
        })
      );

      setReports(
        reportResults.filter((item) => item !== null)
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to load reports.");
    } finally {
      setLoading(false);
    }
  };

  fetchReports();
}, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Research Reports
          </h1>

          <p className="mt-2 text-lg text-slate-600 dark:text-slate-300">
            View the research reports generated from your projects.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-10 shadow-sm">
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="h-10 w-10 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-slate-900 dark:border-t-white"></div>

                <p className="text-slate-600 dark:text-slate-300">
                  Loading reports...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* No Projects */}
        {!loading && projects.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              No projects found
            </h2>

            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Create a research project to generate a report.
            </p>
          </div>
        )}

        {/* No Reports */}
        {!loading &&
          projects.length > 0 &&
          reports.length === 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-10 text-center shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                No research reports available
              </h2>

              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Your projects do not have generated research reports yet.
              </p>
            </div>
          )}

        {/* Reports */}
        {!loading && reports.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {reports.map(({ project, report }) => (
              <div
                key={project.id}
                className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-sm"
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                  {project.name}
                </h2>

                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {project.description ||
                    "Research report generated for this project."}
                </p>

                <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-800 p-4">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Report
                  </p>

                  <p className="mt-1 text-slate-900 dark:text-white">
                    Available
                  </p>
                </div>

                {report?.ai_summary && (
                  <div className="mt-5">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      AI Summary
                    </p>

                    <div className="mt-3 space-y-4 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {report.ai_summary.executive_summary && (
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Executive Summary
                          </p>
                          <p className="mt-1">
                            {report.ai_summary.executive_summary}
                          </p>
                        </div>
                      )}

                      {report.ai_summary.research_summary && (
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Research Summary
                          </p>
                          <p className="mt-1">
                            {report.ai_summary.research_summary}
                          </p>
                        </div>
                      )}

                      {report.ai_summary.productivity_insights && (
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            Productivity Insights
                          </p>
                          <p className="mt-1">
                            {report.ai_summary.productivity_insights}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}