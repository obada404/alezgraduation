import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

/**
 * Get all categories (Public)
 */
export const fetchCategories = () => apiGet("/categories");

/**
 * Get category by ID (Public)
 * @param {string} id - Category ID
 */
export const fetchCategoryById = (id) => apiGet(`/categories/${id}`);

/**
 * Create a category (Admin only)
 * @param {object} categoryData - Category data { name: string }
 */
export const createCategory = (categoryData) => apiPost("/categories", categoryData);

/**
 * Update a category (Admin only)
 * @param {string} id - Category ID
 * @param {object} categoryData - Updated category data { name: string }
 */
export const updateCategory = (id, categoryData) => apiPatch(`/categories/${id}`, categoryData);

/**
 * Delete a category (Admin only)
 * @param {string} id - Category ID
 */
export const deleteCategory = (id) => apiDelete(`/categories/${id}`);


