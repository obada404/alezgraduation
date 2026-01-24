import { apiGet, apiPost } from "./client";

/**
 * Get all orders (Admin only)
 */
export async function fetchAllOrders() {
  return await apiGet("/orders");
}

/**
 * Get order by ID (Admin only)
 * @param {string} id - Order ID
 */
export async function fetchOrderById(id) {
  return await apiGet(`/orders/${id}`);
}

/**
 * Create order from cart (Admin only)
 * @param {object} orderData - Order data with cartId
 */
export async function createOrderFromCart(orderData) {
  return await apiPost("/orders/from-cart", orderData);
}

