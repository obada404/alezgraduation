const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export const getToken = () => {
  try {
    return localStorage.getItem("auth_token");
  } catch (err) {
    return null;
  }
};

export const setToken = (token) => {
  try {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  } catch (err) {
    // ignore storage errors
  }
};

export const clearToken = () => {
  setToken(null);
  setIsAdmin(false);
};

export const getIsAdmin = () => {
  try {
    const isAdmin = localStorage.getItem("is_admin");
    return isAdmin === "true";
  } catch (err) {
    return false;
  }
};

export const setIsAdmin = (isAdmin) => {
  try {
    if (isAdmin) {
      localStorage.setItem("is_admin", "true");
    } else {
      localStorage.removeItem("is_admin");
    }
  } catch (err) {
    // ignore storage errors
  }
};

const buildHeaders = (customHeaders = {}) => {
  const headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "ngrok-skip-browser-warning": "true",
    ...customHeaders,
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export async function apiRequest(path, { method = "GET", body, headers } = {}) {
  if (!API_BASE_URL) {
    throw new Error("VITE_API_BASE_URL is not set");
  }

  const fullUrl = `${API_BASE_URL}${path}`;
  console.log(`=== apiRequest: ${method} ${fullUrl} ===`);
  
  const res = await fetch(fullUrl, {
    method,
    headers: buildHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });
  
  console.log(`=== apiRequest response: ${res.status} ${res.statusText} for ${path} ===`);

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    let message =
      data?.message ||
      data?.error ||
      `Request failed with status ${res.status}`;
    
    // Translate common error messages to Arabic
    // For login endpoint, don't translate 401 - let the component handle it
    if ((message.includes("Unauthorized") || res.status === 401) && !path.includes("/auth/login")) {
      message = "يجب تسجيل الدخول للمتابعة";
    }
    
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const apiGet = (path) => {
  console.log("=== apiGet called with path:", path, "Full URL:", `${API_BASE_URL}${path}`);
  return apiRequest(path, { method: "GET" });
};
export const apiPost = (path, body) =>
  apiRequest(path, { method: "POST", body });
export const apiPatch = (path, body) =>
  apiRequest(path, { method: "PATCH", body });
export const apiDelete = (path) => apiRequest(path, { method: "DELETE" });


