import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getResearchNotes } from "../../services/researchNoteService";

export default function ProjectResearchNotes({ projectId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

   useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getResearchNotes(projectId);

        setNotes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load research notes.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [projectId]);

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;

    const keyword = search.toLowerCase();

    return notes.filter((note) => {
      return (
        note.title?.toLowerCase().includes(keyword) ||
        note.question?.toLowerCase().includes(keyword) ||
        note.answer?.toLowerCase().includes(keyword)
      );
    });
  }, [notes, search]);

  const formatDate = (value) => {
    if (!value) return "Unknown";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Unknown";
    }

    return date.toLocaleString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Research Notes
          </h2>

          <p className="mt-2 text-slate-500">
            Loading your saved research findings...
          </p>
        </div>

        <div className="flex min-h-[280px] items-center justify-center rounded-3xl border border-slate-200 bg-slate-50">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

            <p className="text-slate-500">
              Loading research notes...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-2xl">
              📝
            </div>

            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Research Notes
              </h2>

              <p className="mt-1 text-slate-500">
                {filteredNotes.length}{" "}
                {filteredNotes.length === 1 ? "note" : "notes"} found
              </p>
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-80">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search research notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-slate-900 outline-none transition-all duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="flex min-h-[360px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-8">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-50 text-5xl">
              📝
            </div>

            <h3 className="text-2xl font-bold text-slate-900">
              No Research Notes Found
            </h3>

            <p className="mt-3 leading-7 text-slate-500">
              {search.trim()
                ? "Try searching with a different keyword."
                : "Save important AI findings and research insights to build your knowledge base."}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {filteredNotes.map((note) => (
            <article
              key={note.id}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
            >
              {/* Note Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-xl transition-transform duration-300 group-hover:scale-110">
                      📝
                    </div>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      Research Note
                    </span>
                  </div>

                  <h3 className="text-xl font-bold leading-7 text-slate-900">
                    {note.title}
                  </h3>
                </div>

                {note.is_favorite && (
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-xl text-amber-500"
                    title="Favorite note"
                  >
                    ★
                  </span>
                )}
              </div>

              {/* Question */}
              {note.question && (
                <section className="mt-6">
                  <h4 className="mb-2 text-sm font-bold uppercase tracking-wide text-blue-600">
                    Research Question
                  </h4>

                  <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-slate-700">
                    {note.question}
                  </div>
                </section>
              )}

              {/* Answer */}
              {note.answer && (
                <section className="mt-6">
                  <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-emerald-600">
                    AI Finding
                  </h4>

                  <div className="prose prose-slate max-w-none rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {note.answer}
                    </ReactMarkdown>
                  </div>
                </section>
              )}

              {/* Citations */}
              {note.citations && note.citations.length > 0 && (
                <section className="mt-6">
                  <h4 className="mb-3 text-sm font-bold text-slate-700">
                    Sources
                  </h4>

                  <div className="space-y-2">
                    {[
                      ...new Map(
                        note.citations.map((citation) => {
                          const filename =
                            typeof citation === "string"
                              ? citation
                              : citation.filename || "Unknown";

                          return [filename, { filename }];
                        })
                      ).values(),
                    ].map((citation, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600"
                      >
                        <span>📄</span>

                        <span className="truncate">
                          {citation.filename}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-5 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Created {formatDate(note.created_at)}
                </span>

                <span className="font-medium text-slate-400">
                  Note #{note.id}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}