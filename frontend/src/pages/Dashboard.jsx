import { useState, useEffect } from "react";
import api from "../services/api";

import {
  FaRobot,
  FaFileUpload,
  FaCode,
  FaGraduationCap,
  FaDatabase,
  FaChartLine,
} from "react-icons/fa";

export default function Dashboard() {

  const [question, setQuestion] = useState("");
const [messages, setMessages] = useState([]);
const [loading, setLoading] = useState(false);

const askQuestion = async () => {
  if (!question.trim()) return;

  // Add user message
  const userMessage = {
    type: "user",
    text: question,
  };
  
  setActivities((prev) => [
  `💬 Asked: ${question}`,
  ...prev,
]);

  setMessages((prev) => [...prev, userMessage]);

  try {
    setLoading(true);

    const res = await api.post("/chat/", {
      question: question,
    });

    // Add AI response
    const aiMessage = {
      type: "assistant",
      text: res.data.answer,
    };

    setMessages((prev) => [...prev, aiMessage]);
  } catch (err) {
    console.error(err);

    setMessages((prev) => [
      ...prev,
      {
        type: "assistant",
        text: "Error connecting to backend",
      },
    ]);
  } finally {
    setLoading(false);
    setQuestion("");
  }
};

  const [stats, setStats] = useState({
  vectors: 0,
  documents: 0,
  chromadb: "Loading..."
});

const [files, setFiles] = useState([]);
const [search, setSearch] = useState("");
const [activities, setActivities] = useState([
  "🚀 Dashboard Started",
]);

useEffect(() => {
  loadStats();
  loadFiles();
}, []);

const loadStats = async () => {
  try {
    const res = await api.get("/dashboard/stats");
    setStats(res.data);
  } catch (err) {
    console.error(err);
  }
};

const loadFiles = async () => {
  try {
    const res = await api.get("/dashboard/files");

    setFiles(res.data.files);

    setActivities([
      `📄 Loaded ${res.data.files.length} files`,
      "🚀 Dashboard Started",
    ]);
  } catch (err) {
    console.error(err);
  }
};

  const cards = [
  { icon: <FaRobot />, title: "AI Chat", value: "Online" },
  { icon: <FaFileUpload />, title: "Vectors", value: stats.vectors },
  { icon: <FaCode />, title: "Documents", value: stats.documents },
  { icon: <FaGraduationCap />, title: "Database", value: stats.chromadb },
];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background:
          "linear-gradient(135deg,#020617,#0f172a,#1e293b)",
        color: "white",
        fontFamily: "Segoe UI",
      }}
    >
     

      {/* Main */}
      <div
        style={{
          flex: 1,
          padding: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            marginBottom: "25px",
          }}
        >
          Research Dashboard
        </h1>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "20px",
          }}
        >
          {cards.map((card, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                padding: "25px",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "30px",
                  marginBottom: "15px",
                }}
              >
                {card.icon}
              </div>

              <h3>{card.title}</h3>

              <h1
                style={{
                  marginTop: "10px",
                  color: "#38bdf8",
                }}
              >
                {card.value}
              </h1>
            </div>
          ))}
        </div>

        {/* Main Content */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "20px",
    marginTop: "25px",
  }}
>
  {/* Research Assistant */}
  <div
    style={{
      background: "rgba(255,255,255,0.08)",
      borderRadius: "20px",
      padding: "25px",
    }}
  >
    <h2>💬 Research Assistant</h2>

    <div
      style={{
        minHeight: "300px",
        maxHeight: "300px",
        overflowY: "auto",
        marginTop: "15px",
        background: "#0f172a",
        borderRadius: "15px",
        padding: "15px",
      }}
    >
      {messages.length === 0 ? (
        <p>🤖 Ask a research question to get started</p>
      ) : (
        messages.map((msg, index) => (
          <p key={index}>
            <strong>
              {msg.type === "user" ? "👤 You" : "🤖 AI"}:
            </strong>{" "}
            {msg.text}
          </p>
        ))
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
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask a research question..."
        style={{
          flex: 1,
          padding: "12px",
          borderRadius: "10px",
          border: "none",
        }}
      />

      <button
        onClick={askQuestion}
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          padding: "12px 20px",
          borderRadius: "10px",
        }}
      >
        Send
      </button>
    </div>
  </div>

  {/* Uploaded Files */}
  <div
    style={{
      background: "rgba(255,255,255,0.08)",
      padding: "20px",
      borderRadius: "20px",
    }}
  >
    <h3>📁 Uploaded Files</h3>

    {files.map((file, index) => (
      <p key={index}>📄 {file}</p>
    ))}
  </div>
</div>

{/* Bottom Cards */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(3,1fr)",
    gap: "20px",
    marginTop: "20px",
  }}
>
  <div
    style={{
      background: "rgba(255,255,255,0.08)",
      padding: "20px",
      borderRadius: "20px",
    }}
  >
    <h3><FaChartLine /> AI Analytics</h3>
    <p>📄 Documents: {stats.documents}</p>
    <p>🧠 Vectors: {stats.vectors}</p>
    <p>💾 Database: {stats.chromadb}</p>
  </div>

  <div
    style={{
      background: "rgba(255,255,255,0.08)",
      padding: "20px",
      borderRadius: "20px",
    }}
  >
    <h3><FaDatabase /> Vector Database</h3>
    <p>Status: {stats.chromadb}</p>
    <p>Vectors: {stats.vectors}</p>
  </div>

  <div
    style={{
      background: "rgba(255,255,255,0.08)",
      padding: "20px",
      borderRadius: "20px",
    }}
  >
      <div>
    <h3>🕒 Recent Activity</h3>

    {activities.map((activity, index) => (
      <p key={index}>{activity}</p>
    ))}
  </div>
</div>

      </div>
    </div>
    </div>
  );
}

