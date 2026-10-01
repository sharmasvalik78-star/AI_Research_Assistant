import api from "./api";

/**
 * Returns the complete research report for a project.
 */
export async function getResearchReport(projectId) {
  const response = await api.get(
    `/research-reports/${projectId}`
  );

  return response.data;
}

/**
 * Returns a public research report using its share token.
 * This endpoint does NOT require JWT authentication.
 */
export async function getPublicResearchReport(shareToken) {
  const response = await api.get(
    `/public/research-reports/${shareToken}`
  );

  return response.data;
}

/**
 * Creates a share link for a project with advanced share controls.
 */
export async function createResearchReportShare(
  projectId,
  {
    isPublic = true,
    allowDownload = true,
    expiresAt = null,
  } = {}
) {
  const response = await api.post(
    `/research-report-shares/${projectId}`,
    null,
    {
      params: {
        is_public: isPublic,
        allow_download: allowDownload,
        expires_at: expiresAt,
      },
    }
  );

  return response.data;
}

/**
 * Updates whether a share link is public or private.
 */
export async function updateResearchReportPublicStatus(
  shareToken,
  isPublic
) {
  const response = await api.patch(
    `/research-report-shares/${shareToken}/public`,
    null,
    {
      params: {
        is_public: isPublic,
      },
    }
  );

  return response.data;
}

/**
 * Updates whether downloading is allowed for a share link.
 */
export async function updateResearchReportDownloadPermission(
  shareToken,
  allowDownload
) {
  const response = await api.patch(
    `/research-report-shares/${shareToken}/download`,
    null,
    {
      params: {
        allow_download: allowDownload,
      },
    }
  );

  return response.data;
}

/**
 * Permanently revokes a share link.
 */
export async function revokeResearchReportShare(shareToken) {
  const response = await api.delete(
    `/research-report-shares/${shareToken}`
  );

  return response.data;
}

/**
 * Downloads a public research report using its share token.
 */
export async function downloadPublicResearchReport(shareToken) {
  const response = await api.get(
    `/public/research-reports/${shareToken}/download`,
    {
      responseType: "blob",
    }
  );

  const blob = new Blob([response.data], {
    type: response.headers["content-type"] || "application/pdf",
  });

  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "research-report.pdf";

  document.body.appendChild(link);
  link.click();
  link.remove();

  window.URL.revokeObjectURL(url);
}