import API from "./api";

/**
 * Get Analytics Overview
 */
export const getAnalyticsOverview = async (days = 30) => {
  const response = await API.get(`/analytics/overview?days=${days}`);
  return response.data;
};