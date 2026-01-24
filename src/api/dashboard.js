import { apiGet } from "./client";

/**
 * Get dashboard statistics (Admin only)
 */
export async function fetchDashboardStats() {
  return await apiGet("/dashboard/stats");
}

/**
 * Get overview counts (Admin only)
 */
export async function fetchDashboardOverview() {
  return await apiGet("/dashboard/overview");
}

/**
 * Get products count by category (Admin only)
 */
export async function fetchProductsByCategory() {
  return await apiGet("/dashboard/products/by-category");
}

/**
 * Get recent activity (Admin only)
 */
export async function fetchRecentActivity() {
  return await apiGet("/dashboard/recent-activity");
}

/**
 * Get cart statistics (Admin only)
 */
export async function fetchCartStatistics() {
  return await apiGet("/dashboard/cart-statistics");
}

