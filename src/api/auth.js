import { apiPost, setToken, clearToken, getToken, setIsAdmin } from "./client";

export async function login(email, password) {
  const data = await apiPost("/auth/login", { email, password });
  // Backend returns accessToken (camelCase) or access_token (snake_case)
  const token = data?.accessToken || data?.access_token;
  if (token) {
    setToken(token);
  }
  // Save isAdmin flag
  if (data?.isAdmin !== undefined) {
    setIsAdmin(data.isAdmin);
  }
  return data;
}

export async function signup(payload) {
  const data = await apiPost("/auth/signup", payload);
  // Signup doesn't return a token - user needs to login separately
  // If backend does return a token, handle it
  const token = data?.accessToken || data?.access_token;
  if (token) {
    setToken(token);
  }
  return data;
}

export function logout() {
  clearToken();
  setIsAdmin(false);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export async function loginWithMobile(mobileNumber) {
  const data = await apiPost("/auth/login/mobile", { mobileNumber });
  // Backend returns accessToken (camelCase) or access_token (snake_case)
  const token = data?.accessToken || data?.access_token;
  if (token) {
    setToken(token);
  }
  // Save isAdmin flag
  if (data?.isAdmin !== undefined) {
    setIsAdmin(data.isAdmin);
  }
  return data;
}

