import API from "./api";

/**
 * Create a research note.
 */
export const createResearchNote = async ({
  title,
  question,
  answer,
  citations = [],
  tags = [],
  session_id = null,
}) => {
  const payload = {
    title,
    question,
    answer,
    citations,
    tags,
    session_id,
  };

  const response = await API.post(
    "/research-notes",
    payload
  );

  return response.data;
};

/**
 * Get research notes.
 * If projectId is provided, only notes for that project are returned.
 */
export const getResearchNotes = async (projectId = null) => {
  const response = await API.get("/research-notes", {
    params:
      projectId !== null
        ? { project_id: projectId }
        : {},
  });

  return response.data;
};

/**
 * Get a single research note.
 */
export const getResearchNote = async (noteId) => {
  const response = await API.get(
    `/research-notes/${noteId}`
  );

  return response.data;
};

/**
 * Update a research note.
 */
export const updateResearchNote = async (
  noteId,
  data
) => {
  const response = await API.put(
    `/research-notes/${noteId}`,
    data
  );

  return response.data;
};

/**
 * Delete a research note.
 */
export const deleteResearchNote = async (
  noteId
) => {
  await API.delete(
    `/research-notes/${noteId}`
  );
};