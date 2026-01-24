import { apiGet, apiPatch } from "./client";

/**
 * Get About Us page content (Public)
 */
export async function fetchAboutUs() {
  return await apiGet("/app-config/about-us");
}

/**
 * Update About Us page content (Admin only)
 * @param {object} aboutUsData - About Us content data
 */
export async function updateAboutUs(aboutUsData) {
  return await apiPatch("/app-config/about-us", aboutUsData);
}

/**
 * Get app configuration (Admin only)
 */
export async function fetchAppConfig() {
  return await apiGet("/app-config");
}

