import type { LoginRequest, LoginResponse, CurrentUser, ValidateTokenResponse } from "@/lib/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const AUTH_ENDPOINT = `${API_BASE_URL}/api/auth`;

// Helper function to handle API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
    
    // Debug: Log error details
    console.error('❌ API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      errorData
    });
    
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }
  return response.json();
}

export const authApi = {
  // Login user
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🚀 POST /api/auth/login', { username: credentials.username });
    const response = await fetch(`${AUTH_ENDPOINT}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse<LoginResponse>(response);
  },

  // Validate token
  async validateToken(token: string): Promise<ValidateTokenResponse> {
    console.log('🚀 POST /api/auth/validate');
    const response = await fetch(`${AUTH_ENDPOINT}/validate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return handleResponse<ValidateTokenResponse>(response);
  },

  // Get current user
  async getCurrentUser(token: string): Promise<CurrentUser> {
    console.log('🚀 GET /api/auth/me');
    const response = await fetch(`${AUTH_ENDPOINT}/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    return handleResponse<CurrentUser>(response);
  },
};
