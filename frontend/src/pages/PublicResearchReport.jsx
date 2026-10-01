import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  getPublicResearchReport,
  downloadPublicResearchReport,
} from "../services/researchReportService";

export default function PublicResearchReport() {
  const { shareToken } = useParams();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [report, setReport] = useState(null);

  useEffect(() => {
    async function loadReport() {
      try {
        setLoading(true);
        setError("");

        const data = await getPublicResearchReport(shareToken);

        setReport(data);
      } catch (err) {
        setError(
          err?.response?.data?.detail ||
            "Unable to load the shared research report."
        );
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [shareToken]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <h2 className="text-2xl font-bold text-slate-900">
            Loading Research Report...
          </h2>

          <p className="mt-2 text-slate-500">
            Please wait while we prepare the shared report.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="text-5xl">⚠️</div>

          <h2 className="mt-5 text-2xl font-bold text-slate-900">
            Unable to Load Report
          </h2>

          <p className="mt-3 text-slate-500">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Research Report Not Found
          </h2>

          <p className="mt-2 text-slate-500">
            The shared research report could not be found.
          </p>
        </div>
      </div>
    );
  }

  const analytics = report.analytics || {};

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Header */}
<div className="border-b border-slate-200 bg-white">
  <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
      
      <div className="min-w-0 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
          <span>📊</span>
          <span>Public Research Report</span>
        </div>

        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
          {report.project?.name || "Research Report"}
        </h1>

        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-500">
          {report.project?.description ||
            "No project description available."}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span>📅</span>
            <span>
              Created{" "}
              {report.project?.created_at
                ? new Date(
                    report.project.created_at
                  ).toLocaleString()
                : "-"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span>🔗</span>
            <span>Shared research workspace</span>
          </div>
        </div>
      </div>

      {report.allow_download && (
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => downloadPublicResearchReport(shareToken)}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200/60 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            <span>⬇</span>
            Download Report
          </button>
        </div>
      )}
    </div>
  </div>
</div>

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        {/* AI Summary */}
        <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-2xl">
              ✨
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                AI Research Summary
              </h2>

              <p className="mt-1 text-slate-500">
                AI-generated overview of this research project.
              </p>
            </div>
          </div>

          {report.ai_summary ? (
            <div className="mt-8 grid gap-6 lg:grid-cols-3">

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-sm">
                    📌
                  </span>
                  <h3 className="font-bold text-slate-900">
                    Executive Summary
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600 whitespace-pre-wrap">
                  {report.ai_summary.executive_summary ||
                    "No executive summary available."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-sm">
                    🔎
                  </span>
                  <h3 className="font-bold text-slate-900">
                    Research Summary
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600 whitespace-pre-wrap">
                  {report.ai_summary.research_summary ||
                    "No research summary available."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm">
                    🚀
                  </span>
                  <h3 className="font-bold text-slate-900">
                    Productivity Insights
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-600 whitespace-pre-wrap">
                  {report.ai_summary.productivity_insights ||
                    "No productivity insights available."}
                </p>
              </div>
            </div>
          ) : (
            <p className="mt-6 text-slate-500">
              No AI summary available.
            </p>
          )}

        </section>

        {/* Analytics */}
        <section className="mt-10">

          <div className="mb-6">
            <h2 className="text-3xl font-bold text-slate-900">
              Research Analytics
            </h2>

            <p className="mt-2 text-slate-500">
              Overview of activity and research resources.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">

            <AnalyticsCard
              icon="📁"
              label="Projects"
              value={analytics.total_projects || 0}
            />

            <AnalyticsCard
              icon="📄"
              label="Documents"
              value={analytics.total_documents || 0}
            />

            <AnalyticsCard
              icon="💬"
              label="Chat Sessions"
              value={analytics.total_chat_sessions || 0}
            />

            <AnalyticsCard
              icon="✉️"
              label="Messages"
              value={analytics.total_messages || 0}
            />

            <AnalyticsCard
              icon="📝"
              label="Research Notes"
              value={analytics.total_research_notes || 0}
            />

          </div>

        </section>

        {/* Documents */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📄
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Documents
              </h2>

              <p className="text-slate-500">
                Research files included in this project.
              </p>
            </div>
          </div>

          {!report.documents?.length ? (
            <p className="mt-6 text-slate-500">
              No documents available.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">

              {report.documents.map((document) => (
                <div
                  key={document.id}
                  className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-2xl transition-transform duration-200 group-hover:scale-105">
                    📄
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-900">
                      {document.filename}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      Uploaded{" "}
                      {document.uploaded_at
                        ? new Date(
                            document.uploaded_at
                          ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* Chat Sessions */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-2xl">
              💬
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Chat Sessions
              </h2>

              <p className="text-slate-500">
                AI research conversations from this project.
              </p>
            </div>
          </div>

          {!report.chat_sessions?.length ? (
            <p className="mt-6 text-slate-500">
              No chat sessions available.
            </p>
          ) : (
            <div className="mt-6 space-y-4">

              {report.chat_sessions.map((chat) => (
                <div
                  key={chat.id}
                  className="rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {chat.title}
                      </h3>

                      <p className="mt-1 text-sm text-slate-400">
                        Created{" "}
                        {chat.created_at
                          ? new Date(
                              chat.created_at
                            ).toLocaleString()
                          : "-"}
                      </p>
                    </div>

                    <div className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600">
                      {chat.message_count || 0} messages
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* Research Notes */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl">
              📝
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Research Notes
              </h2>

              <p className="text-slate-500">
                Important findings saved during research.
              </p>
            </div>
          </div>

          {!report.research_notes?.length ? (
            <p className="mt-6 text-slate-500">
              No research notes available.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {report.research_notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-2xl border border-slate-200 p-6"
                >
                  <div className="flex items-start justify-between gap-4">

                    <h3 className="font-bold text-slate-900">
                      {note.title}
                    </h3>

                    {note.is_favorite && (
                      <span className="text-xl text-amber-400">
                        ★
                      </span>
                    )}

                  </div>

                  {note.tags?.length > 0 && (
                    <div className="mt-5 flex flex-wrap gap-2">

                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600"
                        >
                          #{tag}
                        </span>
                      ))}

                    </div>
                  )}

                  <p className="mt-5 text-sm text-slate-400">
                    {note.created_at
                      ? new Date(
                          note.created_at
                        ).toLocaleString()
                      : "-"}
                  </p>

                </div>
              ))}

            </div>
          )}

        </section>

        {/* Citations */}
        <section className="mt-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-2xl">
              🔗
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Citations
              </h2>

              <p className="text-slate-500">
                Sources referenced during AI research.
              </p>
            </div>
          </div>

          {!report.citations?.length ? (
            <p className="mt-6 text-slate-500">
              No citations available.
            </p>
          ) : (
            <div className="mt-6 space-y-5">

              {[
                ...new Map(
                  report.citations.map((citation) => [
                    `${citation.filename}-${citation.chunk}`,
                    citation,
                  ])
                ).values(),
              ].map((citation, index) => (
                <div
                  key={`${citation.filename}-${citation.chunk}-${index}`}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📚</span>

                    <div>
                      <p className="font-semibold text-slate-900">
                        {citation.filename}
                      </p>

                      <p className="text-sm text-slate-400">
                        Chunk {citation.chunk ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">

                    <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                      <p className="mb-2 text-sm font-bold text-blue-700">
                        APA
                      </p>

                      <p className="text-sm leading-6 text-slate-700">
                        {citation.apa || "APA citation unavailable."}
                      </p>
                    </div>

                    <div className="rounded-xl border border-violet-100 bg-violet-50 p-4">
                      <p className="mb-2 text-sm font-bold text-violet-700">
                        IEEE
                      </p>

                      <p className="text-sm leading-6 text-slate-700">
                        {citation.ieee || "IEEE citation unavailable."}
                      </p>
                    </div>

                    <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                      <p className="mb-2 text-sm font-bold text-emerald-700">
                        MLA
                      </p>

                      <p className="text-sm leading-6 text-slate-700">
                        {citation.mla || "MLA citation unavailable."}
                      </p>
                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Generated with AI Research Assistant Pro
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Shared research report
          </p>
        </div>
      </footer>

    </div>
  );
}

function AnalyticsCard({ icon, label, value }) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-xl transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>

      <p className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-500">
        {label}
      </p>
    </div>
  );
}