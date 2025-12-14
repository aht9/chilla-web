export interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  phoneNumber?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// --- DTOs ---

// پاسخ لاگین و رفرش توکن
export interface LoginResponseDto {
  isProfileCompleted: boolean;
  message?: string;
}

// 1. /api/auth/request-otp
export interface RequestOtpRequest {
  phoneNumber: string;
}

// 2. /api/auth/login-otp
export interface LoginOtpRequest {
  phoneNumber: string;
  code: string;
}

// 3. /api/auth/login-password
export interface LoginPasswordRequest {
  username: string;
  password: string;
}

// 4. /api/auth/complete-profile
export interface CompleteProfileRequest {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
}

// 5. /api/users/me
export type UserProfileDto = User;

// /api/auth/forgot-password
export interface ForgotPasswordRequest {
  phoneNumber: string;
}

// /api/auth/reset-password
export interface ResetPasswordRequest {
  phoneNumber: string;
  code: string;
  newPassword: string;
  confirmNewPassword: string;
}
