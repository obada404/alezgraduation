import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

/**
 * Get active promotions
 */
export const fetchActivePromotions = () => {
  console.log("=== fetchActivePromotions called, path: /promotions/active ===");
  return apiGet("/promotions/active");
};

/**
 * Get all promotions
 * @param {boolean} includeInactive - Include inactive promotions
 */
export const fetchPromotions = (includeInactive = false) => 
  apiGet(`/promotions?includeInactive=${includeInactive}`);

/**
 * Get promotion by ID
 * @param {string} id - Promotion ID
 */
export const fetchPromotionById = (id) => apiGet(`/promotions/${id}`);

/**
 * Create a promotion (Admin only)
 * @param {object} promotionData - Promotion data
 */
export const createPromotion = (promotionData) => 
  apiPost("/promotions", promotionData);

/**
 * Update a promotion (Admin only)
 * @param {string} id - Promotion ID
 * @param {object} promotionData - Updated promotion data
 */
export const updatePromotion = (id, promotionData) => 
  apiPatch(`/promotions/${id}`, promotionData);

/**
 * Delete a promotion (Admin only)
 * @param {string} id - Promotion ID
 */
export const deletePromotion = (id) => 
  apiDelete(`/promotions/${id}`);

/**
 * Toggle promotion active status (Admin only)
 * @param {string} id - Promotion ID
 */
export const togglePromotionActive = (id) => 
  apiPatch(`/promotions/${id}/toggle-active`, {});


