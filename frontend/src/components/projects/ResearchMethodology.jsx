import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  generateResearchMethodology,
} from "../../services/documentService";

export default function ResearchMethodology({
  projectId,
  documents = [],
}) {
  const [methodology, setMethodology] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateMethodology = async () => {
    if (documents.length === 0) {
      toast.error(
        "No documents available for methodology generation."
      );
      return;
    }

    try {
      setLoading(true);

      const documentIds = documents.map(
        (document) => document.id
      );

      const response =
        await generateResearchMethodology(
          documentIds,
          projectId
        );

      setMethodology(
        response.research_methodology || ""
      );

      toast.success(
        "Research methodology generated successfully."
      );
    } catch (error) {
      console.error(
        "Research Methodology Generation Error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Failed to generate research methodology."
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
            AI Research Methodology
          </h2>

          <p className="mt-2 text-slate-500">
            Generate a structured research methodology
            from your uploaded research documents.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateMethodology}
          disabled={
            loading || documents.length === 0
          }
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Methodology"}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">
            Upload documents to generate a research
            methodology.
          </p>
        </div>
      ) : methodology ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-slate-900">
              Generated Research Methodology
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Methodology extracted and organized from
              your research documents.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-700">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                h2: ({ children }) => (
                    <h2 className="mb-6 mt-2 text-2xl font-bold text-slate-900">
                    {children}
                    </h2>
                ),
                h3: ({ children }) => (
                    <h3 className="mb-3 mt-7 text-xl font-bold text-slate-900">
                    {children}
                    </h3>
                ),
                p: ({ children }) => (
                    <p className="mb-4 leading-7 text-slate-700">
                    {children}
                    </p>
                ),
                ul: ({ children }) => (
                    <ul className="mb-4 list-disc space-y-2 pl-6">
                    {children}
                    </ul>
                ),
                ol: ({ children }) => (
                    <ol className="mb-4 list-decimal space-y-2 pl-6">
                    {children}
                    </ol>
                ),
                li: ({ children }) => (
                    <li className="leading-7">
                    {children}
                    </li>
                ),
                strong: ({ children }) => (
                    <strong className="font-semibold text-slate-900">
                    {children}
                    </strong>
                ),
                hr: () => (
                    <hr className="my-6 border-slate-300" />
                ),
                }}
            >
                {methodology}
            </ReactMarkdown>
            </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No methodology generated yet
          </h3>

          <p className="mt-2 text-slate-500">
            Click "Generate Methodology" to analyze your
            research documents.
          </p>
        </div>
      )}
    </div>
  );
}