export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'customer';
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  user: AuthUser;
}

export interface MeResponse {
  user: AuthUser;
}
