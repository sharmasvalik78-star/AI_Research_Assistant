import API from "./api";

/**
 * Get all chat sessions for a project.
 */
export const getProjectChatSessions = async (
  projectId
) => {
  const response = await API.get(
    `/projects/${projectId}/chats`
  );

  return response.data;
};

/**
 * Create a new chat session inside a project.
 */
export const createProjectChatSession = async (
  projectId,
  title = "New Chat"
) => {
  const response = await API.post(
    `/projects/${projectId}/chats`,
    {
      title,
    }
  );

  return response.data;
};

/**
 * Get messages for a project chat session.
 */
export const getProjectChatMessages = async (
  projectId,
  chatId
) => {
  const response = await API.get(
    `/projects/${projectId}/chats/${chatId}/messages`
  );

  return response.data;
};

/**
 * Rename a project chat session.
 */
export const renameProjectChatSession = async (
  projectId,
  chatId,
  title
) => {
  const response = await API.put(
    `/projects/${projectId}/chats/${chatId}`,
    {
      title,
    }
  );

  return response.data;
};

/**
 * Delete a project chat session.
 */
export const deleteProjectChatSession = async (
  projectId,
  chatId
) => {
  const response = await API.delete(
    `/projects/${projectId}/chats/${chatId}`
  );

  return response.data;
};

/**
 * Ask AI inside a project chat.
 */
export const askProjectQuestion = async (
  projectId,
  payload
) => {
  console.log(
    "Project Chat Payload:",
    JSON.stringify(payload, null, 2)
  );

  const response = await API.post(
    `/projects/${projectId}/chat`,
    payload
  );

  return response.data;
};