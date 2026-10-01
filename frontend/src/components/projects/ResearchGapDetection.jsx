import { useState } from "react";
import toast from "react-hot-toast";

import { detectResearchGaps } from "../../services/documentService";

export default function ResearchGapDetection({
  projectId,
  documents = [],
}) {
  const [researchGaps, setResearchGaps] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDetectGaps = async () => {
    if (documents.length === 0) {
      toast.error(
        "No documents available for research gap detection."
      );
      return;
    }

    try {
      setLoading(true);

      const documentIds = documents.map(
        (document) => document.id
      );

      const response = await detectResearchGaps(
        documentIds,
        projectId
      );

      setResearchGaps(
        response.research_gaps || ""
      );

      toast.success(
        "Research gaps detected successfully."
      );
    } catch (error) {
      console.error(
        "Research Gap Detection Error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Failed to detect research gaps."
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
            Research Gap Detection
          </h2>

          <p className="mt-2 text-slate-500">
            Identify research gaps, unanswered questions,
            limitations, and potential future research directions.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDetectGaps}
          disabled={
            loading ||
            documents.length === 0
          }
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Analyzing..."
            : "Detect Research Gaps"}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">
            Upload documents to detect research gaps.
          </p>
        </div>
      ) : researchGaps ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-2xl">
              🔍
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                AI Research Gap Analysis
              </h3>

              <p className="text-sm text-slate-500">
                Analysis generated from the selected research documents.
              </p>
            </div>
          </div>

          <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-700">
            {researchGaps}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-slate-500">
            Click "Detect Research Gaps" to analyze your research documents.
          </p>
        </div>
      )}

    </div>
  );
}