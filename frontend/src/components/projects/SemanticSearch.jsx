import { useState } from "react";
import toast from "react-hot-toast";
import { semanticSearchDocuments } from "../../services/documentService";

export default function SemanticSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      toast.error("Enter a search query.");
      return;
    }

    try {
      setLoading(true);

      const response = await semanticSearchDocuments(
        trimmedQuery,
        10
      );

      setResults(response.results || []);

      if (!response.results?.length) {
        toast("No relevant results found.");
      }
    } catch (error) {
      console.error(
        "Semantic Search Error:",
        error
      );

      toast.error(
        error?.response?.data?.detail ||
          "Semantic search failed."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Semantic Search
        </h2>

        <p className="mt-2 text-slate-500">
          Search semantically across all your research
          documents and projects.
        </p>
      </div>

      {/* Search Box */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            onKeyDown={handleKeyDown}
            placeholder="Search across all research documents..."
            className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="button"
            onClick={handleSearch}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </div>

      {/* Results */}
      {results.length > 0 ? (
        <div className="space-y-5">
          <div>
            <h3 className="text-xl font-bold text-slate-900">
              Search Results
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Found {results.length} relevant research
              passages.
            </p>
          </div>

          {results.map((result, index) => (
            <div
              key={`${result.document_id}-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {result.filename ||
                      "Unknown Document"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Document ID:{" "}
                    {result.document_id ?? "N/A"}
                  </p>
                </div>

                {result.distance !== null &&
                  result.distance !== undefined && (
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
                      Distance:{" "}
                      {Number(
                        result.distance
                      ).toFixed(4)}
                    </span>
                  )}
              </div>

              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-4">
                <p className="whitespace-pre-wrap leading-7 text-slate-700">
                  {result.chunk}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
          <p className="text-slate-500">
            Enter a concept, topic, or research question
            to search across your documents.
          </p>
        </div>
      )}
    </div>
  );
}