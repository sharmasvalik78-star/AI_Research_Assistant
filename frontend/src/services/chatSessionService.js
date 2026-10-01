import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Get all chat sessions
export const getChatSessions = async () => {
    const res = await API.get("/chat/sessions");
    return res.data;
};

// Get messages for a session
export const getSessionMessages = async (sessionId) => {
    const res = await API.get(`/chat/sessions/${sessionId}/messages`);
    return res.data;
};

// Create a new session
export const createChatSession = async (
    title,
    projectId = null,
) => {
    const payload = {
        title,
    };

    if (projectId !== null) {
        payload.project_id = projectId;
    }

    const res = await API.post(
        "/chat/sessions",
        payload,
    );

    return res.data;
};

// Rename a session
export const renameChatSession = async (
    sessionId,
    title,
) => {
    const res = await API.put(
        `/chat/sessions/${sessionId}`,
        {
            title,
        },
    );

    return res.data;
};

// Delete a session
export const deleteChatSession = async (
    sessionId,
) => {
    const res = await API.delete(
        `/chat/sessions/${sessionId}`,
    );

    return res.data;
};