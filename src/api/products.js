import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

/**
 * Get all products (Public)
 */
export const fetchProducts = () => apiGet("/products");

/**
 * Get product by ID (Public)
 * @param {string} id - Product ID
 */
export const fetchProduct = (id) => apiGet(`/products/${id}`);

/**
 * Create a product (Admin only)
 * @param {FormData} formData - Product data with images
 */
export const createProduct = (formData) => {
  // Note: This uses apiRequest directly because FormData needs special handling
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const token = localStorage.getItem("auth_token");
  
  const headers = {
    "ngrok-skip-browser-warning": "true",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers,
    body: formData,
  }).then(async (res) => {
    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await res.json() : null;
    
    if (!res.ok) {
      throw new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
    }
    
    return data;
  });
};

/**
 * Update a product (Admin only)
 * @param {string} id - Product ID
 * @param {FormData} formData - Updated product data with images
 */
export const updateProduct = (id, formData) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
  const token = localStorage.getItem("auth_token");
  
  const headers = {
    "ngrok-skip-browser-warning": "true",
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  return fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers,
    body: formData,
  }).then(async (res) => {
    const contentType = res.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await res.json() : null;
    
    if (!res.ok) {
      throw new Error(data?.message || data?.error || `Request failed with status ${res.status}`);
    }
    
    return data;
  });
};

/**
 * Delete a product (Admin only)
 * @param {string} id - Product ID
 */
export const deleteProduct = (id) => apiDelete(`/products/${id}`);


