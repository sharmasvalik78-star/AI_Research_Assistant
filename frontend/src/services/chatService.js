import API from "./api";

/**
 * Create an empty chat session.
 */
export const createChatSession = async () => {
  const response = await API.post("/chat/sessions");
  return response.data;
};

/**
 * Ask a question.
 * Supports:
 * - Normal chat
 * - Project chat
 * - Single document
 * - Multi-document
 */
export const askQuestion = async ({
  question,
  document_id = null,
  document_ids = null,
  session_id = null,
  project_id = null,
}) => {
  const payload = {
    question,
  };

  // Prefer multi-document
  if (
    Array.isArray(document_ids) &&
    document_ids.length > 0
  ) {
    payload.document_ids = document_ids;
  }

  // Backward compatibility
  else if (document_id !== null) {
    payload.document_id = document_id;
  }

  if (session_id !== null) {
    payload.session_id = session_id;
  }

  // Project-aware chat (optional)
  if (project_id !== null) {
    payload.project_id = project_id;
  }

  console.log("Chat payload:", payload);

  const response = await API.post(
    "/chat/ask",
    payload
  );

  return response.data;
};