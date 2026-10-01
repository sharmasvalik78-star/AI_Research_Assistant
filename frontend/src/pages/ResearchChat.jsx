import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import ChatSidebar from "../components/layout/ChatSidebar";

const MarkdownMessage = lazy(
  () => import("../components/chat/MarkdownMessage")
);

import {
  getChatSessions,
  getSessionMessages,
  createChatSession,
  renameChatSession,
  deleteChatSession,
} from "../services/chatSessionService";

import { askQuestion } from "../services/chatService";

import {
  getProjectChatSessions,
  createProjectChatSession,
  getProjectChatMessages,
  renameProjectChatSession,
  deleteProjectChatSession,
  askProjectQuestion,
} from "../services/projectChatService";

import { createResearchNote } from "../services/researchNoteService";

import {
  getDocuments,
  getProjectDocuments,
} from "../services/documentService";

import "./ResearchChat.css";

export default function ResearchChat({
  projectId = null,
}) {
  const [documents, setDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);

  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  const [messages, setMessages] = useState([]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const messagesEndRef = useRef(null);

const isProjectMode = projectId !== null;

// projectId is optional.
// null = Global Chat (current behavior)
// number = Project Workspace mode

useEffect(() => {
  loadDocuments();
  loadSessions();
}, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  function scrollToBottom() {
  const container = messagesEndRef.current?.parentElement;

  if (container) {
    container.scrollTop = container.scrollHeight;
  }
}

  async function loadDocuments() {
  try {
    const docs = isProjectMode
      ? await getProjectDocuments(projectId)
      : await getDocuments();

    setError("");
    setDocuments(docs);

    if (docs.length > 0) {
      setSelectedDocuments([docs[0].id]);
    }
  } catch (err) {
    console.error(err);
    setError("Unable to load research documents.");
  }
}

  async function loadSessions() {
  try {
    const data = isProjectMode
      ? await getProjectChatSessions(projectId)
      : await getChatSessions();

    setError("");
    setSessions(data);

    if (selectedSession) {
      const updatedSelection = data.find(
        (session) => session.id === selectedSession.id
      );

      if (updatedSelection) {
        setSelectedSession(updatedSelection);
      }
    }
  } catch (err) {
    console.error(err);
    setError("Unable to load chat sessions.");
  }
}

  async function handleSessionSelect(session) {
  setSelectedSession(session);

  try {
    const data = isProjectMode
      ? await getProjectChatMessages(projectId, session.id)
      : await getSessionMessages(session.id);

    setError("");
    setMessages(data);
  } catch (err) {
    console.error(err);
    setError("Unable to load chat messages.");
    setMessages([]);
  }
}

  async function handleNewChat() {
  try {
    const session = isProjectMode
      ? await createProjectChatSession(projectId, "New Chat")
      : await createChatSession("New Chat");

    await loadSessions();

    setSelectedSession(session);
    setMessages([]);
    setQuestion("");

    setSessions((prev) => {
      const filtered = prev.filter(
        (s) => s.id !== session.id
      );

      return [session, ...filtered];
    });
  } catch (err) {
    console.error(err);
    setError("Unable to create new chat.");
  }
}

  async function handleRenameSession(session) {
    const newTitle = window.prompt(
      "Rename conversation",
      session.title
    );

    if (!newTitle) return;

    if (newTitle.trim() === "") return;

    try {
      if (isProjectMode) {
  await renameProjectChatSession(
    projectId,
    session.id,
    newTitle.trim()
  );
} else {
  await renameChatSession(
    session.id,
    newTitle.trim()
  );
}

      await loadSessions();

      if (selectedSession?.id === session.id) {
        setSelectedSession((prev) =>
          prev
            ? {
                ...prev,
                title: newTitle.trim(),
              }
            : prev
        );
      }
    } catch (err) {
      console.error(err);
      console.log(err.response);
      setError("Unable to rename chat.");
    }
  }

  async function handleDeleteSession(session) {
    const confirmed = window.confirm(
      "Delete this conversation?"
    );

    if (!confirmed) return;

    try {
      if (isProjectMode) {
  await deleteProjectChatSession(
    projectId,
    session.id
  );
} else {
  if (isProjectMode) {
  await deleteProjectChatSession(
    projectId,
    session.id
  );
} else {
  await deleteChatSession(session.id);
}
}

      if (selectedSession?.id === session.id) {
        setSelectedSession(null);
        setMessages([]);
        setQuestion("");
      }

      await loadSessions();
    } catch (err) {
      console.error(err);
      console.log(err.response);
      setError("Unable to delete chat.");
    }
  }
  async function handleAskQuestion() {
  if (loading) return;

  if (!question.trim()) return;

  if (selectedDocuments.length === 0) {
      alert("Please select at least one document.");
    return;
  }

  const currentQuestion = question;

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: currentQuestion,
    },
  ]);

  setQuestion("");
  setError("");
  setLoading(true);

  try {
    let currentSession = selectedSession;

if (isProjectMode && !currentSession) {
  currentSession = await createProjectChatSession(
    projectId,
    "New Chat"
  );

  setSelectedSession(currentSession);
  await loadSessions();
}

const response = isProjectMode
  ? await askProjectQuestion(projectId, {
      question: currentQuestion,
      document_ids: selectedDocuments,
      session_id: currentSession.id,
    })
  : await askQuestion({
      question: currentQuestion,
      document_ids: selectedDocuments,
      session_id: selectedSession?.id ?? null,
    });

    setError("");

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          response.answer ||
          response.response ||
          "No response received.",
        context: response.context || [],
        session_id: response.session_id ?? null,
      },
    ]);

    // Auto rename chat using the first question
if (isProjectMode && currentSession) {
  const existingSession = sessions.find(
    (s) => s.id === currentSession.id
  );

  if (
    !existingSession ||
    existingSession.title === "New Chat"
  ) {
    const title =
      currentQuestion.length > 60
        ? currentQuestion.substring(0, 60) + "..."
        : currentQuestion;

    await renameProjectChatSession(
      projectId,
      currentSession.id,
      title
    );

    currentSession = {
      ...currentSession,
      title,
    };

    setSelectedSession(currentSession);
  }
}

await loadSessions();

if (!selectedSession) {
  const updatedSessions = isProjectMode
    ? await getProjectChatSessions(projectId)
    : await getChatSessions();

  setSessions(updatedSessions);

  if (updatedSessions.length > 0) {
    const newestSession = updatedSessions[0];

    setSelectedSession(newestSession);

    try {
      const sessionMessages = isProjectMode
        ? await getProjectChatMessages(projectId, newestSession.id)
        : await getSessionMessages(newestSession.id);

      setMessages(sessionMessages);
    } catch (err) {
      console.error(err);
    }
  }
}
  } catch (err) {
  console.error(err);
  console.log(err.response?.data);

  setError("Error generating response.");

  setMessages((prev) => [
    ...prev,
    {
      role: "assistant",
      content: "Error generating response.",
      context: [],
    },
  ]);
} finally {
  setLoading(false);
}
}

const handleSaveResearchNote = useCallback(async (messageIndex) => {
  try {
    const aiMessage = messages[messageIndex];

    if (!aiMessage || aiMessage.role !== "assistant") {
      return;
    }

    let question = "";

    for (let i = messageIndex - 1; i >= 0; i--) {
      if (messages[i].role === "user") {
        question = messages[i].content;
        break;
      }
    }

    console.log(
  "Saving Research Note",
  JSON.stringify(
    {
      session_id:
        aiMessage.session_id ??
        selectedSession?.id ??
        null,
      selectedSession,
      aiMessage,
    },
    null,
    2
  )
);

const savedNote = await createResearchNote({
  title:
    question.length > 60
      ? question.substring(0, 60) + "..."
      : question,
  question,
  answer: aiMessage.content,
  citations:
  (aiMessage.context || []).map((citation) => ({
    filename: citation.filename,
    chunk:
      typeof citation.chunk === "number"
        ? citation.chunk
        : 0,
  })),
  session_id:
    aiMessage.session_id ??
    selectedSession?.id ??
    null,
});

console.log(
  "Saved Note:",
  JSON.stringify(savedNote, null, 2)
);

alert("Research note saved successfully.");
   } catch (err) {
    console.error(err);
    alert("Unable to save research note.");
  }
}, [messages, selectedSession]);

function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleAskQuestion();
    }
}

return (
    <div className="research-chat-container">
      <ChatSidebar
        sessions={sessions}
        selectedSession={selectedSession}
        onSelectSession={handleSessionSelect}
        onNewChat={handleNewChat}
        onRenameSession={handleRenameSession}
        onDeleteSession={handleDeleteSession}
      />

      <div className="research-chat-main">
        <div className="research-chat-header">
          <label htmlFor="research-document-selector" className="sr-only">
              Select research documents
          </label>

          <select
              id="research-document-selector"
              multiple
              value={selectedDocuments.map(String)}
            onChange={(e) => {
              const values = Array.from(
                e.target.selectedOptions,
                (option) => Number(option.value)
            );

            setSelectedDocuments(values);
          }}
           size={Math.min(documents.length, 8)}
      >
          {documents.map((doc) => (
            <option key={doc.id} value={doc.id}>
              {doc.filename}
            </option>
          ))}
         </select>
        </div>

        <div className="research-chat-messages">
            {error && (
                <div className="chat-error">
                    {error}
                </div>
            )}
            
            {messages.length === 0 ? (
            <div className="empty-chat">
              Start asking questions about your document.
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.role}`}>
                <strong>{msg.role === "user" ? "You" : "AI"}</strong>

                <Suspense fallback={<p>Loading message...</p>}>
                  <MarkdownMessage content={msg.content} />
                </Suspense>

                {msg.role === "assistant" && (
                  <div style={{ marginTop: "10px", marginBottom: "10px" }}>
                    <button onClick={() => handleSaveResearchNote(index)}>
                      💾 Save Note
                    </button>
                  </div>
                )}

                {msg.role === "assistant" &&
                  msg.context &&
                  msg.context.length > 0 && (
                    <details className="sources-panel">
                      <summary>
                        📚 Sources Used (
                        {
                          [...new Set(msg.context.map((source) => source.filename))]
                            .length
                        }
                        )
                      </summary>

                      {[...new Set(msg.context.map((source) => source.filename))].map(
                        (filename, i) => (
                          <div key={i} className="source-item">
                            <strong>📄 {filename}</strong>
                          </div>
                        )
                      )}
                    </details>
                  )}
              </div>
            ))
          )}

          {loading && (
            <div className="chat-message assistant">
              <strong>AI</strong>
              <p>Thinking...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="research-chat-input">

          <label htmlFor="research-question" className="sr-only">
              Ask a research question
          </label>

          <textarea
            id="research-question"
            rows={3}
            placeholder="Ask a question about your selected document(s)..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button
            onClick={handleAskQuestion}
            disabled={loading}
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}