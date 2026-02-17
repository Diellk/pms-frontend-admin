export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  userType: string;
}

export interface CurrentUser {
  userId: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  userType: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  message: string;
}
