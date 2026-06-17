import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
  if (!file) {
    setStatus("Please select a file");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await api.post(
      "/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setStatus(`✅ ${res.data.filename} uploaded successfully`);
  } catch (err) {
    console.error(err);
    setStatus("❌ Upload failed");
  }
};

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div
        style={{
          width: "650px",
          background: "#111827",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid #1e293b",
          textAlign: "center",
        }}
      >
        <FaCloudUploadAlt
          size={70}
          color="#38bdf8"
          style={{ marginBottom: "20px" }}
        />

        <h1
          style={{
            color: "white",
            fontSize: "32px",
            marginBottom: "10px",
          }}
        >
          Upload Documents
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "25px",
          }}
        >
          Upload PDF or DOCX files
        </p>

        <label
          style={{
            display: "inline-block",
            padding: "12px 24px",
            background: "#1e40af",
            color: "white",
            borderRadius: "10px",
            cursor: "pointer",
            marginBottom: "20px",
          }}
        >
          Choose File
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            style={{ display: "none" }}
          />
        </label>

        <div
          style={{
            color: "#cbd5e1",
            marginBottom: "20px",
          }}
        >
          {file ? file.name : "No file selected"}
        </div>

        <button
          onClick={handleUpload}
          style={{
            background: "#06b6d4",
            color: "white",
            border: "none",
            padding: "12px 30px",
            borderRadius: "10px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Upload File
        </button>

        {status && (
  <p
    style={{
      marginTop: "20px",
      color: "#cbd5e1",
    }}
  >
    {status}
  </p>
)}
      </div>
    </div>
  );
}