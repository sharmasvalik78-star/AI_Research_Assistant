import { useEffect, useRef, useState } from "react";

import { uploadDocument } from "../../../services/documentService";
import { getProjects } from "../../../services/projectService";

import ProjectSelector from "./ProjectSelector";
import FilePreview from "./FilePreview";
import UploadProgress from "./UploadProgress";

export default function UploadBox() {
  const inputRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");

   useEffect(() => {
    let cancelled = false;

    getProjects()
      .then((data) => {
        if (!cancelled) {
          setProjects(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    setSelectedFile(file);
    setMessage("");
    setProgress(0);
  };

  const handleChange = (e) => {
    handleFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("Please select a file.");
      return;
    }

    try {
      setUploading(true);

      const result = await uploadDocument(
        selectedFile,
        selectedProject || null,
        (event) => {
          if (event.total) {
            setProgress(
              Math.round(
                (event.loaded * 100) / event.total
              )
            );
          }
        }
      );

      setMessage(
        result.message || "Upload successful."
      );

      setSelectedFile(null);
      setSelectedProject("");
      setProgress(100);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.detail ||
          "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="rounded-2xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-white via-blue-50/40 to-blue-100/40 p-8 shadow-lg transition hover:border-blue-400 sm:p-10"
    >
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          Upload Research Document
        </h2>

        <p className="text-gray-500 mb-6">
          Drag & Drop PDF, DOCX or TXT here
        </p>

        <ProjectSelector
          projects={projects}
          selectedProject={selectedProject}
          onChange={setSelectedProject}
          disabled={uploading}
        />

        <button
          onClick={() => inputRef.current.click()}
          disabled={uploading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          Select File
        </button>

        <input
          ref={inputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleChange}
        />

        {selectedFile && (
          <>
            <FilePreview file={selectedFile} />

            <UploadProgress
              uploading={uploading}
              progress={progress}
            />

            <button
              onClick={handleUpload}
              disabled={uploading}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {uploading
                ? "Uploading..."
                : "Upload"}
            </button>
          </>
        )}

        {message && (
          <div
            role="status"
            aria-live="polite"
            className="mt-4 text-sm text-green-600"
          >
            {message}
          </div>
        )}
      </div>
    </div> 
  );
}