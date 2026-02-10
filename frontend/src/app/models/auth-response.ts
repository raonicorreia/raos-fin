export interface AuthResponse {
  token: string;
  userId: number;
  email: string;
  name: string;
  active?: boolean;
}