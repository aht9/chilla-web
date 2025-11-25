export interface User {
  readonly id: string;
  username: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  hasActivePlan: boolean;
  hasPendingCart: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface SendOtpRequest {
  mobile: string;
}
export interface VerifyOtpRequest {
  mobile: string;
  code: string;
}
export interface RegisterRequest {
  mobile: string; // موبایل تایید شده
  code: string; // کد تایید نهایی (جهت امنیت سمت سرور)
  username: string;
  password: string;
  fullName: string;
  email?: string;
}
export interface LoginRequest {
  username: string;
  password: string;
}
