import { apiGet, apiPost, apiPatch, apiDelete } from "./client";

/**
 * Get user cart
 */
export const fetchCart = () => apiGet("/cart");

/**
 * Add item to cart
 * @param {object} payload - Cart item data
 */
export const addToCart = (payload) => apiPost("/cart/items", payload);

/**
 * Update cart item quantity
 * @param {string} itemId - Cart item ID
 * @param {object} payload - Updated quantity
 */
export const updateCartItem = (itemId, payload) =>
  apiPatch(`/cart/items/${itemId}`, payload);

/**
 * Remove item from cart
 * @param {string} itemId - Cart item ID
 */
export const removeCartItem = (itemId) =>
  apiDelete(`/cart/items/${itemId}`);

/**
 * Clear all cart items
 */
export const clearCart = () => apiDelete("/cart/clear");

/**
 * Get all carts (Admin only)
 */
export const fetchAllCarts = () => apiGet("/cart/admin/all");

/**
 * Get cart by ID (Admin only)
 * @param {string} cartId - Cart ID
 */
export const fetchCartById = (cartId) => apiGet(`/cart/admin/${cartId}`);


