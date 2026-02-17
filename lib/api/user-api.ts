import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  ChangePasswordRequest,
  UserStatistics,
  UserRole,
} from "@/lib/types/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";
const ADMIN_USERS_ENDPOINT = `${API_BASE_URL}/api/admin/users`;

// Helper function to get auth token from localStorage or wherever you store it
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

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

// Helper function to create headers with auth
function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true", // Required for ngrok free tier
  };
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

export const userApi = {
  // Create a new user
  async createUser(userData: CreateUserRequest): Promise<User> {
    console.log('🚀 POST /api/admin/users', { userData });
    const response = await fetch(ADMIN_USERS_ENDPOINT, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse<User>(response);
  },

  // Get all users with optional filters
  async getAllUsers(filters?: { role?: UserRole; active?: boolean }): Promise<User[]> {
    const queryParams = new URLSearchParams();
    if (filters?.role) queryParams.append("role", filters.role);
    if (filters?.active !== undefined) queryParams.append("active", String(filters.active));

    const url = queryParams.toString()
      ? `${ADMIN_USERS_ENDPOINT}?${queryParams}`
      : ADMIN_USERS_ENDPOINT;

    console.log('🚀 GET', url, { filters });
    const response = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User[]>(response);
  },

  // Get user by ID
  async getUserById(id: number): Promise<User> {
    console.log('🚀 GET /api/admin/users/:id', { id });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User>(response);
  },

  // Get user by username
  async getUserByUsername(username: string): Promise<User> {
    console.log('🚀 GET /api/admin/users/username/:username', { username });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/username/${username}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User>(response);
  },

  // Get users by role
  async getUsersByRole(role: UserRole): Promise<User[]> {
    console.log('🚀 GET /api/admin/users/role/:role', { role });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/role/${role}`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User[]>(response);
  },

  // Get active users
  async getActiveUsers(): Promise<User[]> {
    console.log('🚀 GET /api/admin/users/active');
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/active`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User[]>(response);
  },

  // Get inactive users
  async getInactiveUsers(): Promise<User[]> {
    console.log('🚀 GET /api/admin/users/inactive');
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/inactive`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<User[]>(response);
  },

  // Get user statistics
  async getUserStatistics(): Promise<UserStatistics> {
    console.log('🚀 GET /api/admin/users/statistics');
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/statistics`, {
      method: "GET",
      headers: getHeaders(),
    });
    return handleResponse<UserStatistics>(response);
  },

  // Update user
  async updateUser(id: number, userData: UpdateUserRequest): Promise<User> {
    console.log('🚀 PUT /api/admin/users/:id', { id, userData });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse<User>(response);
  },

  // Change user password
  async changePassword(id: number, passwordData: ChangePasswordRequest): Promise<{ message: string }> {
    console.log('🚀 PUT /api/admin/users/:id/password', { id });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}/password`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(passwordData),
    });
    return handleResponse<{ message: string }>(response);
  },

  // Activate user
  async activateUser(id: number): Promise<User> {
    console.log('🚀 POST /api/admin/users/:id/activate', { id });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}/activate`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse<User>(response);
  },

  // Deactivate user
  async deactivateUser(id: number): Promise<User> {
    console.log('🚀 POST /api/admin/users/:id/deactivate', { id });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}/deactivate`, {
      method: "POST",
      headers: getHeaders(),
    });
    return handleResponse<User>(response);
  },

  // Delete user
  async deleteUser(id: number): Promise<{ message: string }> {
    console.log('🚀 DELETE /api/admin/users/:id', { id });
    const response = await fetch(`${ADMIN_USERS_ENDPOINT}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    return handleResponse<{ message: string }>(response);
  },
};
