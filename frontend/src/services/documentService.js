import API from "./api";

// ======================================
// Upload Document
// ======================================
export const uploadDocument = async (
  file,
  projectId = null,
  onUploadProgress
) => {
  const formData = new FormData();

  formData.append("file", file);

  if (projectId !== null && projectId !== "") {
    formData.append("project_id", projectId);
  }

  const response = await API.post(
    "/documents/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  );

  return response.data;
};

// ======================================
// Get All Documents
// ======================================
export const getDocuments = async () => {
  const response = await API.get("/documents");
  return response.data;
};

// ======================================
// Get Project Documents
// ======================================
export const getProjectDocuments = async (
  projectId
) => {
  const response = await API.get(
    `/documents/project/${projectId}`
  );

  return response.data;
};

// ======================================
// Delete Document
// ======================================
export const deleteDocument = async (
  documentId
) => {
  const response = await API.delete(
    `/documents/${documentId}`
  );

  return response.data;
};

// ======================================
// Generate Research Timeline
// ======================================
export const generateResearchTimeline = async (
  documentIds = [],
  projectId = null
) => {
  const params = {};

  if (documentIds.length > 0) {
    params.document_ids = documentIds;
  }

  if (projectId !== null && projectId !== "") {
    params.project_id = projectId;
  }

  const response = await API.post(
    "/documents/timeline",
    null,
    {
      params,
    }
  );

  return response.data;
};

// ======================================
// Generate Knowledge Graph
// ======================================
export const generateKnowledgeGraph = async (
  documentIds = [],
  projectId = null
) => {
  const params = {};

  if (documentIds.length > 0) {
    params.document_ids = documentIds;
  }

  if (projectId !== null && projectId !== "") {
    params.project_id = projectId;
  }

  const response = await API.post(
    "/documents/knowledge-graph",
    null,
    {
      params,
    }
  );

  return response.data;
};

// ======================================
// Detect Research Gaps
// ======================================
export const detectResearchGaps = async (
  documentIds = [],
  projectId = null
) => {
  const params = {};

  if (documentIds.length > 0) {
    params.document_ids = documentIds;
  }

  if (projectId !== null && projectId !== "") {
    params.project_id = projectId;
  }

  const response = await API.post(
    "/documents/research-gaps",
    null,
    {
      params,
    }
  );

  return response.data;
};

// ======================================
// Generate AI Research Presentation
// ======================================

export const generateResearchPresentation = async (
  documentIds = [],
  projectId = null
) => {
  const params = {};

  if (documentIds.length > 0) {
    params.document_ids = documentIds;
  }

  if (projectId !== null && projectId !== "") {
    params.project_id = projectId;
  }

  const response = await API.post(
    "/documents/presentation",
    null,
    {
      params,
    }
  );

  return response.data;
};

// ======================================
// Semantic Search Across All Projects
// ======================================

export const semanticSearchDocuments = async (
  queryText,
  topK = 10
) => {
  const response = await API.post(
    "/documents/semantic-search",
    null,
    {
      params: {
        query_text: queryText,
        top_k: topK,
      },
    }
  );

  return response.data;
};

// ======================================
// Generate AI Research Questions
// ======================================

export const generateResearchQuestions = async (
  documentIds = [],
  projectId = null
) => {
  const params = {};

  if (documentIds.length > 0) {
    params.document_ids = documentIds;
  }

  if (projectId !== null && projectId !== "") {
    params.project_id = projectId;
  }

  const response = await API.post(
    "/documents/research-questions",
    null,
    {
      params,
    }
  );

  return response.data;
};

// ======================================
// Generate AI Research Methodology
// ======================================

export const generateResearchMethodology = async (
  documentIds = [],
  projectId = null
) => {
  const params = {};

  if (documentIds.length > 0) {
    params.document_ids = documentIds;
  }

  if (projectId !== null && projectId !== "") {
    params.project_id = projectId;
  }

  const response = await API.post(
    "/documents/research-methodology",
    null,
    {
      params,
    }
  );

  return response.data;
};