import { useState } from "react";
import toast from "react-hot-toast";

import { generateKnowledgeGraph } from "../../services/documentService";

export default function KnowledgeGraph({
  projectId,
  documents = [],
}) {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateGraph = async () => {
    if (documents.length === 0) {
      toast.error("No documents available for knowledge graph generation.");
      return;
    }

    try {
      setLoading(true);

      const documentIds = documents.map(
        (document) => document.id
      );

      const response = await generateKnowledgeGraph(
        documentIds,
        projectId
      );

      setGraph(response.graph || null);

      toast.success("Knowledge graph generated.");
    } catch (error) {
      console.error(
        "Knowledge Graph Error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Failed to generate knowledge graph."
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
            Knowledge Graph
          </h2>

          <p className="mt-2 text-slate-500">
            Explore important concepts and relationships found in your research.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGenerateGraph}
          disabled={loading || documents.length === 0}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Generating..."
            : "Generate Knowledge Graph"}
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="text-slate-500">
            Upload documents to generate a knowledge graph.
          </p>
        </div>
      ) : graph ? (
        <div className="space-y-8">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Concepts
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {graph.nodes?.map((node) => (
                <div
                  key={node.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <p className="font-semibold text-slate-900">
                    {node.label}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {node.type}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="mb-5 text-xl font-bold text-slate-900">
              Relationships
            </h3>

            <div className="space-y-3">
              {graph.edges?.map((edge, index) => {
                const sourceNode = graph.nodes?.find(
                  (node) => node.id === edge.source
                );

                const targetNode = graph.nodes?.find(
                  (node) => node.id === edge.target
                );

                return (
                  <div
                    key={`${edge.source}-${edge.target}-${index}`}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                  >
                    <span className="font-semibold text-slate-900">
                      {sourceNode?.label || edge.source}
                    </span>

                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      {edge.label}
                    </span>

                    <span className="font-semibold text-slate-900">
                      {targetNode?.label || edge.target}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-slate-500">
            Click "Generate Knowledge Graph" to analyze your research documents.
          </p>
        </div>
      )}
    </div>
  );
}