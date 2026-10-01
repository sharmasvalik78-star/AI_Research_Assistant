import { useEffect, useState } from "react";

import {
  getDocuments,
  deleteDocument,
} from "../services/documentService";

function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setLoading(true);

      const data = await getDocuments();

      setDocuments(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) {
      return;
    }

    try {
      await deleteDocument(id);

      await fetchDocuments();
    } catch (error) {
      console.error(error);
      alert("Failed to delete document.");
    }
  };

  useEffect(() => {
  const loadDocuments = async () => {
    try {
      setLoading(true);

      const data = await getDocuments();

      setDocuments(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load documents.");
    } finally {
      setLoading(false);
    }
  };

  loadDocuments();
}, []);

  const formatSize = (bytes) => {
    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(2)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-lg">
        Loading documents...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10 dark:bg-slate-950">
      <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
        My Documents
      </h1>

      {documents.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">
            No documents uploaded yet.
          </p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Upload a document to start your research.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50 dark:border-slate-700 dark:bg-slate-900 dark:shadow-none">
          <table className="w-full">
            <caption className="sr-only">
              Uploaded documents and available actions
            </caption>
            <thead className="bg-slate-200/70 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              <tr>
                <th scope="col" className="text-left p-4">
                  File Name
                </th>

                <th scope="col" className="text-left p-4">
                  Size
                </th>

                <th scope="col" className="text-left p-4">
                  Uploaded
                </th>

                <th scope="col" className="text-center p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {documents.map((doc) => (
                <tr
                  key={doc.id}
                  className="border-t border-slate-200 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/60"
                >
                  <td className="p-4 font-medium text-slate-800 dark:text-slate-100">
                    {doc.filename}
                  </td>

                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    {formatSize(doc.size)}
                  </td>

                  <td className="p-4 text-sm text-slate-600 dark:text-slate-300">
                    {new Date(
                      doc.uploaded_at
                    ).toLocaleString()}
                  </td>

                  <td className="text-center p-4">
                    <button
                      onClick={() =>
                        handleDeleteDocument(doc.id)
                      }
                      className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Documents;