import { apiGet } from "./client";

/**
 * Get all users (Admin only)
 */
export async function fetchAllUsers() {
  return await apiGet("/users");
}


