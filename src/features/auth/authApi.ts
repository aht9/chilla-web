import { api } from "../../services/api";
import { setCredentials, logout as logoutAction } from "./authSlice";
import type {
  RequestOtpRequest,
  LoginOtpRequest,
  LoginPasswordRequest,
  CompleteProfileRequest,
  LoginResponseDto,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  UserProfileDto,
} from "./types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Request OTP
    requestOtp: builder.mutation<void, RequestOtpRequest>({
      query: (body) => ({
        url: "auth/request-otp",
        method: "POST",
        body,
      }),
    }),

    // 2. Login with OTP
    // نکته: اینجا User ست نمی‌شود، فقط تگ باطل می‌شود تا getProfile دوباره دیتا بگیرد
    loginOtp: builder.mutation<LoginResponseDto, LoginOtpRequest>({
      query: (body) => ({
        url: "auth/login-otp",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 3. Login with Password
    loginPassword: builder.mutation<LoginResponseDto, LoginPasswordRequest>({
      query: (body) => ({
        url: "auth/login-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 4. Refresh Token
    refreshToken: builder.mutation<LoginResponseDto, void>({
      query: () => ({
        url: "auth/refresh-token",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    // 5. Complete Profile
    completeProfile: builder.mutation<void, CompleteProfileRequest>({
      query: (body) => ({
        url: "auth/complete-profile",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 6. Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logoutAction());
          dispatch(api.util.resetApiState());
        } catch {
          /* empty */
        }
      },
    }),

    // 7. Get User Profile (منبع اصلی اطلاعات کاربر)
    getProfile: builder.query<UserProfileDto, void>({
      query: () => "users/me",
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // وقتی اطلاعات کاربر آمد، در ریداکس ذخیره می‌شود و isAuthenticated true می‌شود
          dispatch(setCredentials(data));
        } catch {
          /* empty */
        }
      },
    }),

    // 8. Forgot Password (Request Reset OTP)
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (body) => ({
        url: "auth/forgot-password",
        method: "POST",
        body,
      }),
    }),

    // 9. Reset Password (Confirm OTP & Set New Pass)
    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRequestOtpMutation,
  useLoginOtpMutation,
  useLoginPasswordMutation,
  useCompleteProfileMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
