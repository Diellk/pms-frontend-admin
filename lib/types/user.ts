export enum UserRole {
  ADMIN = "ADMIN",
  FRONT_DESK = "FRONT_DESK",
  HOUSEKEEPING = "HOUSEKEEPING",
  MAINTENANCE = "MAINTENANCE",
  GUEST = "GUEST"
}

export interface User {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  role: UserRole;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  fullName: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  username?: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  active?: boolean;
}

export interface ChangePasswordRequest {
  newPassword: string;
}

export interface UserStatistics {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  administratorCount: number;
  frontDeskCount: number;
  housekeepingCount: number;
  maintenanceCount: number;
}

export interface ApiError {
  error: string;
}
