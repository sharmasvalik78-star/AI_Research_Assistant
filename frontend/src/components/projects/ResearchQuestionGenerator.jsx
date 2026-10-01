import { useState } from "react";
import toast from "react-hot-toast";

import {
  generateResearchQuestions,
} from "../../services/documentService";

export default function ResearchQuestionGenerator({
  projectId,
  documents = [],
}) {
  const [researchQuestions, setResearchQuestions] =
    useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestions = async () => {
    if (documents.length === 0) {
      toast.error(
        "No documents available for research question generation."
      );
      return;
    }

    try {
      setLoading(true);

      const documentIds = documents.map(
        (document) => document.id
      );

      const response =
        await generateResearchQuestions(
          documentIds,
          projectId
        );

      setResearchQuestions(
        response.research_questions || ""
      );

      toast.success(
        "Research questions generated successfully."
      );
    } catch (error) {
      console.error(
        "Research Question Generation Error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Failed to generate research questions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">
            AI Research Question Generator
          </h2>

          <p className="mt-2 text-slate-500">
            Generate research questions from your
            uploaded research documents.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateQuestions}
          disabled={
            loading || documents.length === 0
          }
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Questions"}
        </button>
      </div>

      {/* No Documents */}
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">
            Upload documents to generate research
            questions.
          </p>
        </div>
      ) : researchQuestions ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h3 className="text-xl font-bold text-slate-900">
              Generated Research Questions
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Questions generated from your research
              documents.
            </p>
          </div>

          <div className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-5 leading-7 text-slate-700">
            {researchQuestions}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No research questions generated yet
          </h3>

          <p className="mt-2 text-slate-500">
            Click "Generate Questions" to analyze your
            research documents.
          </p>
        </div>
      )}
    </div>
  );
}