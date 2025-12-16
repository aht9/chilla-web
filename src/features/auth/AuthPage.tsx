import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { useLocation, useNavigate } from "react-router-dom";

import {
  useRequestOtpMutation,
  useLoginOtpMutation,
  useLoginPasswordMutation,
  useCompleteProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyGetProfileQuery,
} from "./authApi";
import type { AuthStep } from "./components/authType";
import { MobileEntryForm } from "./components/MobileEntryForm";
import { PasswordLoginForm } from "./components/PasswordLoginForm";
import { OtpVerification } from "./components/OtpVerification";
import { RegisterDetailsForm } from "./components/RegisterDetailsForm";
import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { ResetPasswordForm } from "./components/ResetPasswordForm";
import { AuthBanner } from "./components/AuthBanner";

export const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  // --- States ---
  const [step, setStep] = useState<AuthStep>("MOBILE_ENTRY");

  // Form States
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // New Password Reset States
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // --- API Hooks ---
  const [requestOtp, { isLoading: isRequestingOtp }] = useRequestOtpMutation();
  const [loginOtp, { isLoading: isOtpLoginLoading }] = useLoginOtpMutation();
  const [loginPassword, { isLoading: isPassLoginLoading }] =
    useLoginPasswordMutation();
  const [completeProfile, { isLoading: isRegistering }] =
    useCompleteProfileMutation();

  // دریافت پروفایل (فقط برای آپدیت ریداکس بعد از لاگین موفق یا ثبت‌نام)
  const [getProfile, { isFetching: isFetchingProfile }] =
    useLazyGetProfileQuery();

  // Forgot Password Hooks
  const [forgotPassword, { isLoading: isSendingForgotOtp }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResettingPass }] =
    useResetPasswordMutation();

  const isLoading =
    isRequestingOtp ||
    isOtpLoginLoading ||
    isPassLoginLoading ||
    isRegistering ||
    isFetchingProfile;

  // --- Logic: Decision Maker ---
  const handleAuthSuccess = async (loginIsProfileCompleted: boolean) => {
    if (loginIsProfileCompleted) {
      // الف) پروفایل کامل است -> اطلاعات را بگیر (برای نمایش نام و ...) و برو داشبورد
      try {
        const userProfile = await getProfile().unwrap();
        toast.success(`خوش آمدید ${userProfile.firstName || "کاربر عزیز"}`);
        navigate(from, { replace: true });
      } catch (error) {
        console.error("Profile Fetch Error:", error);
        toast.error("ورود انجام شد اما دریافت اطلاعات کاربر با خطا مواجه شد.");
        // حتی اگر خطا داد، چون لاگین شده و کوکی ست شده، می‌توانیم کاربر را بفرستیم داشبورد
        // اما بهتر است اینجا بمانیم یا ریتلای کنیم. فعلاً ارور می‌دهیم.
      }
    } else {
      // ب) پروفایل ناقص است -> برو به فرم تکمیل اطلاعات
      // نیازی به دریافت ID نیست چون در توکن هست
      toast.info("لطفا برای ادامه، اطلاعات کاربری خود را تکمیل کنید.");
      setStep("REGISTER_DETAILS");
    }
  };

  // --- Handlers ---

  // 1. Send OTP
  const handleSendOtp = async () => {
    if (mobile.length < 10) return;
    try {
      await requestOtp({ phoneNumber: mobile }).unwrap();
      toast.success(`کد تایید به ${mobile} ارسال شد`);
      setStep("OTP_VERIFY");
    } catch (error: any) {
      toast.error(error?.data?.detail || "خطا در ارسال کد تایید.");
    }
  };

  // 2. Verify OTP & Login
  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 5) {
      toast.error("کد وارد شده باید ۵ رقم باشد");
      return;
    }
    try {
      const response = await loginOtp({ phoneNumber: mobile, code }).unwrap();
      await handleAuthSuccess(response.isProfileCompleted);
    } catch (error: any) {
      toast.error(error?.data?.detail || "کد تایید اشتباه است.");
    }
  };

  // 3. Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error("نام کاربری و رمز عبور الزامی است");
      return;
    }
    try {
      const response = await loginPassword({ username, password }).unwrap();
      await handleAuthSuccess(response.isProfileCompleted);
    } catch (error: any) {
      toast.error(error?.data?.detail || "نام کاربری یا رمز عبور اشتباه است.");
    }
  };

  // 4. Complete Profile (Register)
  const handleRegisterComplete = async (formData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      // ارسال اطلاعات بدون userId (چون در توکن موجود است)
      await completeProfile(formData).unwrap();

      // بعد از تکمیل، پروفایل را می‌گیریم تا ریداکس آپدیت شود و کاربر "لاگین شده" محسوب شود
      await getProfile().unwrap();

      toast.success("ثبت‌نام تکمیل شد. به چله خوش آمدید!");
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Register Error:", error);
      toast.error(error?.data?.detail || "خطا در ثبت اطلاعات.");
    }
  };

  // Auto-submit OTP
  useEffect(() => {
    if (
      step === "OTP_VERIFY" &&
      otp.every((d) => d !== "") &&
      otp.length === 5
    ) {
      handleVerifyOtp();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otp, step]);

  // --- 5. Forgot Password Logic ---
  const handleForgotPasswordRequest = async () => {
    if (mobile.length < 10) return;
    try {
      await forgotPassword({ phoneNumber: mobile }).unwrap();
      toast.success(`کد بازیابی به ${mobile} ارسال شد`);
      // پاک کردن OTP قبلی اگر مانده باشد
      setOtp(new Array(5).fill(""));
      setStep("RESET_PASSWORD");
    } catch (error: any) {
      toast.error(error?.data?.detail || "خطا در ارسال کد بازیابی.");
    }
  };

  // --- 6. Reset Password Logic ---
  const handleResetPassword = async () => {
    const code = otp.join("");
    if (code.length !== 5) {
      toast.error("کد تایید باید ۵ رقم باشد");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("تکرار رمز عبور مطابقت ندارد");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("رمز عبور باید حداقل ۶ کاراکتر باشد");
      return;
    }

    try {
      await resetPassword({
        phoneNumber: mobile,
        code: code,
        newPassword: newPassword,
        confirmNewPassword: confirmPassword,
      }).unwrap();

      toast.success("رمز عبور با موفقیت تغییر کرد. لطفا وارد شوید.");
      // پاک کردن فیلدها
      setUsername("");
      setPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setOtp(new Array(5).fill(""));

      // هدایت به صفحه لاگین با رمز
      setStep("PASSWORD_LOGIN");
    } catch (error: any) {
      toast.error(
        error?.data?.detail ||
          "خطا در تغییر رمز عبور. کد تایید ممکن است اشتباه باشد."
      );
    }
  };

  // --- UI Titles ---
  const getHeaderTitle = () => {
    switch (step) {
      case "REGISTER_DETAILS":
        return "تکمیل اطلاعات کاربری";
      case "OTP_VERIFY":
        return "تایید شماره موبایل";
      case "PASSWORD_LOGIN":
        return "ورود با رمز عبور";
      case "FORGOT_PASSWORD":
        return "بازیابی رمز عبور"; // <---
      case "RESET_PASSWORD":
        return "تغییر رمز عبور"; // <---
      default:
        return "ورود به حساب";
    }
  };

  const getHeaderSubtitle = () => {
    switch (step) {
      case "OTP_VERIFY":
        return `کد ۵ رقمی ارسال شده به ${mobile} را وارد کنید`;
      case "RESET_PASSWORD":
        return `کد ارسال شده به ${mobile} و رمز جدید را وارد کنید`; // <---
      case "FORGOT_PASSWORD":
        return "شماره موبایل خود را وارد کنید تا کد بازیابی ارسال شود"; // <---
      default:
        return "برای استفاده از امکانات لطفا وارد شوید";
    }
  };

  return (
    <div
      className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-0 lg:p-0 font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-[1600px] h-screen lg:h-auto lg:min-h-[900px] bg-white lg:rounded-[50px] shadow-2xl flex overflow-hidden">
        {/* Forms Section */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getHeaderTitle()}
            </h1>
            <p className="text-gray-500 text-sm">{getHeaderSubtitle()}</p>
          </div>

          {step === "MOBILE_ENTRY" && (
            <MobileEntryForm
              mobile={mobile}
              setMobile={setMobile}
              onSubmit={handleSendOtp} // (این متد در پاسخ‌های قبلی تعریف شده است)
              isLoading={isLoading}
              onSwitchToPassword={() => setStep("PASSWORD_LOGIN")}
            />
          )}

          {step === "PASSWORD_LOGIN" && (
            <>
              <PasswordLoginForm
                username={username}
                setUsername={setUsername}
                password={password}
                setPassword={setPassword}
                onSubmit={handlePasswordLogin} // (این متد در پاسخ‌های قبلی تعریف شده است)
                isLoading={isLoading}
                onBack={() => setStep("MOBILE_ENTRY")}
              />
              {/* لینک فراموشی رمز عبور (بهتر است داخل PasswordLoginForm باشد اما اینجا هم می‌شود اضافه کرد یا پراپ فرستاد) */}
              <div className="mt-4 text-center">
                <button
                  onClick={() => setStep("FORGOT_PASSWORD")}
                  className="text-sm text-blue-600 hover:underline"
                >
                  رمز عبور خود را فراموش کرده‌اید؟
                </button>
              </div>
            </>
          )}

          {step === "OTP_VERIFY" && (
            <OtpVerification
              otp={otp}
              setOtp={setOtp}
              isLoading={isLoading}
              onVerify={handleVerifyOtp} // (این متد در پاسخ‌های قبلی تعریف شده است)
              onBack={() => setStep("MOBILE_ENTRY")}
            />
          )}

          {step === "REGISTER_DETAILS" && (
            <RegisterDetailsForm
              onSubmit={handleRegisterComplete} // (این متد در پاسخ‌های قبلی تعریف شده است)
              isLoading={isLoading}
            />
          )}

          {/* --- New Steps --- */}

          {step === "FORGOT_PASSWORD" && (
            <ForgotPasswordForm
              mobile={mobile}
              setMobile={setMobile}
              onSubmit={handleForgotPasswordRequest}
              isLoading={isLoading}
              onBack={() => setStep("PASSWORD_LOGIN")}
            />
          )}

          {step === "RESET_PASSWORD" && (
            <ResetPasswordForm
              otp={otp}
              setOtp={setOtp}
              newPassword={newPassword}
              setNewPassword={setNewPassword}
              confirmPassword={confirmPassword}
              setConfirmPassword={setConfirmPassword}
              onSubmit={handleResetPassword}
              isLoading={isLoading}
              onBack={() => setStep("FORGOT_PASSWORD")}
            />
          )}
        </div>

        {/* Banner Section */}
        <AuthBanner />
      </div>
    </div>
  );
};
