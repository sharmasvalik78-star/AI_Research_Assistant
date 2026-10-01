import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { generateResearchTimeline } from "../../services/documentService";

export default function ResearchTimeline({
  projectId,
  documents = [],
}) {
  const [timeline, setTimeline] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateTimeline = async () => {
    if (documents.length === 0) {
      toast.error("No documents available for timeline generation.");
      return;
    }

    try {
      setLoading(true);

      const documentIds = documents.map(
        (document) => document.id
      );

      const response = await generateResearchTimeline(
        documentIds,
        projectId
      );

      setTimeline(response.timeline || "");

      toast.success("Research timeline generated.");
    } catch (error) {
      console.error(
        "Research Timeline Error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Failed to generate research timeline."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            Research Timeline
          </h2>

          <p className="mt-2 text-slate-500">
            Generate a chronological timeline from your project documents.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateTimeline}
          disabled={loading || documents.length === 0}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Timeline"}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">
            Upload documents to generate a research timeline.
          </p>
        </div>
      ) : timeline ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <div className="prose prose-slate max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1 className="mb-6 text-3xl font-bold text-slate-900">
                    {children}
                  </h1>
                ),

                h2: ({ children }) => (
                  <h2 className="mb-4 mt-8 text-2xl font-bold text-slate-900">
                    {children}
                  </h2>
                ),

                h3: ({ children }) => (
                  <h3 className="mb-3 mt-6 text-xl font-semibold text-slate-900">
                    {children}
                  </h3>
                ),

                p: ({ children }) => (
                  <p className="mb-4 leading-7 text-slate-700">
                    {children}
                  </p>
                ),

                ul: ({ children }) => (
                  <ul className="mb-5 list-disc space-y-2 pl-6 text-slate-700">
                    {children}
                  </ul>
                ),

                ol: ({ children }) => (
                  <ol className="mb-5 list-decimal space-y-2 pl-6 text-slate-700">
                    {children}
                  </ol>
                ),

                strong: ({ children }) => (
                  <strong className="font-bold text-slate-900">
                    {children}
                  </strong>
                ),

                table: ({ children }) => (
                  <div className="my-6 overflow-x-auto rounded-xl border border-slate-200">
                    <table className="min-w-full border-collapse text-left text-sm">
                      {children}
                    </table>
                  </div>
                ),

                thead: ({ children }) => (
                  <thead className="bg-slate-100">
                    {children}
                  </thead>
                ),

                th: ({ children }) => (
                  <th className="border-b border-slate-200 px-4 py-3 font-semibold text-slate-900">
                    {children}
                  </th>
                ),

                td: ({ children }) => (
                  <td className="border-b border-slate-200 px-4 py-3 align-top text-slate-700">
                    {children}
                  </td>
                ),
              }}
            >
              {timeline}
            </ReactMarkdown>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-slate-500">
            Click "Generate Timeline" to create your research timeline.
          </p>
        </div>
      )}
    </div>
  );
}