import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

/**
 * Get active news items (for news bar)
 */
export async function fetchActiveNews() {
  return await apiGet("/news/active");
}

/**
 * Get all news items
 * @param {boolean} includeInactive - Include inactive news items
 */
export async function fetchAllNews(includeInactive = false) {
  return await apiGet(`/news?includeInactive=${includeInactive}`);
}

/**
 * Get a news item by ID
 * @param {string} id - News item ID
 */
export async function fetchNewsById(id) {
  return await apiGet(`/news/${id}`);
}

/**
 * Create a news item (Admin only)
 * @param {object} newsData - News item data
 */
export async function createNews(newsData) {
  return await apiPost("/news", newsData);
}

/**
 * Update a news item (Admin only)
 * @param {string} id - News item ID
 * @param {object} newsData - Updated news item data
 */
export async function updateNews(id, newsData) {
  return await apiPatch(`/news/${id}`, newsData);
}

/**
 * Delete a news item (Admin only)
 * @param {string} id - News item ID
 */
export async function deleteNews(id) {
  return await apiDelete(`/news/${id}`);
}

/**
 * Toggle news item active status (Admin only)
 * @param {string} id - News item ID
 */
export async function toggleNewsActive(id) {
  return await apiPatch(`/news/${id}/toggle-active`, {});
}

