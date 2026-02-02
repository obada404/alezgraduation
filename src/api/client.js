const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Helper function to decode JWT token and check expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    // JWT tokens have 3 parts separated by dots: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration (exp field)
    if (payload.exp) {
      // exp is in seconds, Date.now() is in milliseconds
      const expirationTime = payload.exp * 1000;
      const currentTime = Date.now();
      
      // Token is expired if current time is past expiration time
      return currentTime >= expirationTime;
    }
    
    // If no expiration field, assume token is valid (for backward compatibility)
    return false;
  } catch (err) {
    // If we can't decode the token, consider it invalid
    return true;
  }
};

export const getToken = () => {
  try {
    const token = localStorage.getItem("auth_token");
    
    // Check if token exists and is not expired
    if (token && !isTokenExpired(token)) {
      return token;
    }
    
    // If token is expired or invalid, remove it
    if (token) {
      clearToken();
    }
    
    return null;
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
  clearMobileNumber();
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

export const getMobileNumber = () => {
  try {
    return localStorage.getItem("mobile_number") || null;
  } catch (err) {
    return null;
  }
};

export const setMobileNumber = (mobileNumber) => {
  try {
    if (mobileNumber) {
      localStorage.setItem("mobile_number", mobileNumber);
    } else {
      localStorage.removeItem("mobile_number");
    }
  } catch (err) {
    // ignore storage errors
  }
};

export const clearMobileNumber = () => {
  setMobileNumber(null);
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
  
  const res = await fetch(fullUrl, {
    method,
    headers: buildHeaders(headers),
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    let message =
      data?.message ||
      data?.error ||
      "حدث خطآ،جاري المتابعة";
    
    // If we get 401 Unauthorized, the token is invalid/expired - clear it
    if (res.status === 401 && !path.includes("/auth/login")) {
      clearToken();
      message = "انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى";
    }
    
    // Translate common error messages to Arabic
    // For login endpoint, don't translate 401 - let the component handle it
    if ((message.includes("Unauthorized") || res.status === 401) && !path.includes("/auth/login")) {
      message = "يجب تسجيل الدخول للمتابعة";
    }
    
    // Removed quantity validation - allow orders to continue even if quantity is insufficient
    // if (message.includes("Insufficient product quantity") || message.includes("insufficient") || message.includes("quantity")) {
    //   message = "الكمية المتاحة غير كافية";
    // }
    
    // Translate other common backend errors to Arabic
    if (message.includes("Bad Request") || message.includes("bad request")) {
      message = "حدث خطآ،جاري المتابعة";
    }
    
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }

  return data;
}

export const apiGet = (path) => {
  return apiRequest(path, { method: "GET" });
};
export const apiPost = (path, body) =>
  apiRequest(path, { method: "POST", body });
export const apiPatch = (path, body) =>
  apiRequest(path, { method: "PATCH", body });
export const apiDelete = (path) => apiRequest(path, { method: "DELETE" });


