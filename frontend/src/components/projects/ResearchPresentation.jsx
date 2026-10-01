import { useState } from "react";
import toast from "react-hot-toast";
import { generateResearchPresentation } from "../../services/documentService";

export default function ResearchPresentation({
  projectId,
  documents = [],
}) {
  const [presentation, setPresentation] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGeneratePresentation = async () => {
    if (documents.length === 0) {
      toast.error(
        "No documents available for presentation generation."
      );
      return;
    }

    try {
      setLoading(true);

      const documentIds = documents.map(
        (document) => document.id
      );

      const response = await generateResearchPresentation(
        documentIds,
        projectId
      );

      setPresentation(
        response.presentation || null
      );

      toast.success(
        "Research presentation generated successfully."
      );
    } catch (error) {
      console.error(
        "Research Presentation Error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Failed to generate research presentation."
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
            AI Research Presentation
          </h2>

          <p className="mt-2 text-slate-500">
            Generate an academic presentation outline
            from your research documents.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGeneratePresentation}
          disabled={
            loading || documents.length === 0
          }
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Presentation"}
        </button>
      </div>

      {/* No documents */}
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">
            Upload documents to generate an AI
            research presentation.
          </p>
        </div>
      ) : presentation ? (
        <div className="space-y-6">
          {/* Presentation Title */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Research Presentation
            </p>

            <h3 className="mt-2 text-2xl font-bold text-slate-900">
              {presentation.title ||
                "Research Presentation"}
            </h3>
          </div>

          {/* Slides */}
          <div className="space-y-6">
            {presentation.slides?.map(
              (slide, index) => (
                <div
                  key={
                    slide.slide_number ??
                    index
                  }
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                      {slide.slide_number ??
                        index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xl font-bold text-slate-900">
                        {slide.title ||
                          `Slide ${
                            index + 1
                          }`}
                      </h4>

                      <ul className="mt-4 space-y-3">
                        {slide.bullets?.map(
                          (bullet, bulletIndex) => (
                            <li
                              key={
                                bulletIndex
                              }
                              className="flex gap-3 text-slate-700"
                            >
                              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" />

                              <span>
                                {bullet}
                              </span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <h3 className="text-lg font-semibold text-slate-900">
            No presentation generated yet
          </h3>

          <p className="mt-2 text-slate-500">
            Click "Generate Presentation" to create
            an AI-powered research presentation.
          </p>
        </div>
      )}
    </div>
  );
}