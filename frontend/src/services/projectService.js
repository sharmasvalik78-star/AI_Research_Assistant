import API from "./api";

// ===============================
// Get All Projects
// ===============================
export const getProjects = async () => {
  const response = await API.get("/projects");
  return response.data;
};

// ===============================
// Get Single Project
// ===============================
export const getProject = async (projectId) => {
  const response = await API.get(
    `/projects/${projectId}`
  );

  return response.data;
};

// ===============================
// Create Project
// ===============================
export const createProject = async (project) => {
  const response = await API.post(
    "/projects",
    project
  );

  return response.data;
};

// ===============================
// Update Project
// ===============================
export const updateProject = async (
  projectId,
  project
) => {
  const response = await API.put(
    `/projects/${projectId}`,
    project
  );

  return response.data;
};

// ===============================
// Delete Project
// ===============================
export const deleteProject = async (
  projectId
) => {
  const response = await API.delete(
    `/projects/${projectId}`
  );

  return response.data;
};