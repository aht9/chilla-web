import type { RootState } from "../../app/store";
import { api } from "../../services/api";
import { setCredentials } from "./authSlice";
import type {
  RegisterRequest,
  VerifyOtpRequest,
  LoginRequest,
  SendOtpRequest,
  User,
} from "./types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    //1.login
    login: builder.mutation<User, LoginRequest>({
      query: (credentials) => ({
        url: "auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled, getState }) {
        const state = getState() as RootState;
        if (state.auth.isAuthenticated) {
          console.warn("User is already logged in!");
          return;
        }

        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          /* empty */
        }
      },
    }),

    //2.get user detail
    getProfile: builder.query<User, void>({
      query: () => "auth/me",
      providesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          /* empty */
        }
      },
    }),

    //3.send sms
    sendOtp: builder.mutation<void, SendOtpRequest>({
      query: (body) => ({
        url: "auth/send-otp",
        method: "POST",
        body,
      }),
    }),

    //4.verify sms
    verifyOtp: builder.mutation<void, VerifyOtpRequest>({
      query: (body) => ({
        url: "auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    //5.Register User
    register: builder.mutation<User, RegisterRequest>({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data));
        } catch {
          /*empty */
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useGetProfileQuery,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterMutation,
} = authApi;
