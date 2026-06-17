import { useState } from "react";
import { FaCode, FaCopy } from "react-icons/fa";
import api from "../services/api";

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");

  const generateCode = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const res = await api.post(
        "/code/generate",
        {
          prompt,
        }
      );

      setCode(res.data.code);
    } catch (err) {
      console.error(err);
      setCode("Error generating code.");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  return (
    <div
      style={{
        padding: "40px",
        color: "white",
      }}
    >
      <div
        style={{
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "20px",
          padding: "30px",
        }}
      >
        <h1
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "25px",
          }}
        >
          <FaCode />
          AI Code Generator
        </h1>

        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Example: Create a Python function for binary search..."
          rows={6}
          style={{
            width: "100%",
            padding: "15px",
            background: "#111827",
            color: "white",
            border: "1px solid #334155",
            borderRadius: "12px",
            resize: "none",
            fontSize: "15px",
          }}
        />

        <button
          onClick={generateCode}
          disabled={loading}
          style={{
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading ? "Generating..." : "Generate Code"}
        </button>

        {generatedCode && (
  <div
    style={{
      marginTop: "20px",
      background: "#0f172a",
      padding: "20px",
      borderRadius: "12px",
      overflowX: "auto",
    }}
  >
    <h3>Generated Code</h3>

    <pre
      style={{
        whiteSpace: "pre-wrap",
        color: "#38bdf8",
      }}
    >
      {generatedCode}
    </pre>
  </div>
)}

        {code && (
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <h3>Generated Code</h3>

              <button
                onClick={copyCode}
                style={{
                  background: "#1e293b",
                  color: "white",
                  border: "none",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                <FaCopy />
              </button>
            </div>

            <pre
              style={{
                background: "#020617",
                color: "#38bdf8",
                padding: "20px",
                borderRadius: "12px",
                overflowX: "auto",
                border: "1px solid #1e293b",
                minHeight: "250px",
              }}
            >
              <code>{code}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}