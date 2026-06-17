import { useState } from "react";
import api from "../services/api";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question.trim()) return;

    try {
      setLoading(true);

      const res = await api.post("/chat/", {
        question: question,
      });

      setAnswer(res.data.answer);
    } catch (err) {
      console.error(err);
      setAnswer("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  style={{
    padding: "30px",
    color: "white",
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.08)",
      borderRadius: "12px",
      padding: "25px",
    }}
  >
    <h1>💬 Research Chat</h1>

    <div
      style={{
        height: "500px",
        overflowY: "auto",
        background: "#0f172a",
        borderRadius: "15px",
        padding: "20px",
        marginTop: "20px",
      }}
    >
      {!answer ? (
        <p style={{ color: "#94a3b8" }}>
          🤖 Ask a research question to get started
        </p>
      ) : (
        <div
  style={{
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    maxWidth: "85%",
    marginTop: "10px",
  }}
>
  <strong>🤖 AI Answer</strong>

  <div
    style={{
      marginTop: "10px",
      lineHeight: "1.8",
      fontSize: "16px",
    }}
  >
    {answer}
  </div>
</div>
      )}
    </div>

    <div
      style={{
        display: "flex",
        gap: "10px",
        marginTop: "15px",
      }}
    >
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask your question..."
        style={{
          flex: 1,
          padding: "15px",
          borderRadius: "10px",
          border: "none",
          outline: "none",
        }}
      />

      <button
        onClick={askQuestion}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "15px 25px",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        {loading ? "🤖 Thinking..." : "Send"}
      </button>
      <button
  onClick={() => {
    setAnswer("");
    setQuestion("");
  }}
  style={{
    background: "#475569",
    color: "white",
    border: "none",
    padding: "15px 25px",
    borderRadius: "10px",
    cursor: "pointer",
  }}
>
  Clear
</button>
    </div>
  </div>
</div>
  );
}