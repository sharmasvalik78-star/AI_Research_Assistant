import { useState } from "react";
import { FaGraduationCap, FaCopy } from "react-icons/fa";
import api from "../services/api";

export default function Viva() {
  const [viva, setViva] = useState("");
  const [loading, setLoading] = useState(false);

  const generateViva = async () => {
    try {
      setLoading(true);

      const res = await api.post(
        "/viva/generate"
      );

      setViva(res.data.viva);
    } catch (err) {
      console.error(err);
      setViva("Error generating viva questions.");
    } finally {
      setLoading(false);
    }
  };

  const copyQuestions = () => {
    navigator.clipboard.writeText(viva);
    alert("Questions copied!");
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
          <FaGraduationCap />
          AI Viva Generator
        </h1>

        <p
          style={{
            color: "#94a3b8",
            marginBottom: "20px",
          }}
        >
          Generate viva questions instantly using AI.
        </p>

        <button
          onClick={generateViva}
          disabled={loading}
          style={{
            background: "#7c3aed",
            color: "white",
            border: "none",
            padding: "12px 25px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {loading
            ? "Generating..."
            : "Generate Viva Questions"}
        </button>

        {viva && (
          <div
            style={{
              marginTop: "30px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <h3>Generated Questions</h3>

              <button
                onClick={copyQuestions}
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
                border: "1px solid #1e293b",
                borderRadius: "12px",
                padding: "20px",
                whiteSpace: "pre-wrap",
                overflowX: "auto",
                minHeight: "250px",
                color: "#e2e8f0",
              }}
            >
              {viva}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}