export type Role = "ADMIN" | "USER" | "OWNER";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING";

export interface User {
  id?: number;
  email: string;
  fullName: string;
  role: Role;
  status: AccountStatus;
  phone?: string;
  avatarUrl?: string | null;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface TokenApiData {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  email: string;
  fullName: string;
  role: Role;
  id: number;
  avtUrl: string | null;
  status: AccountStatus;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  code: string | null;
  data: T;
  timestamp: string | number[];
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  login: (data: LoginResponse) => void;
  logout: () => void;
}
