import React, { useState, useEffect } from "react";
import {
  AuthBanner,
  MobileEntryForm,
  PasswordLoginForm,
  OtpVerification,
  RegisterDetailsForm,
  type AuthStep,
} from "./AuthComponents";

export const AuthPage = () => {
  // مدیریت مراحل و حالت‌ها
  const [step, setStep] = useState<AuthStep>("MOBILE_ENTRY");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (mobile.length < 10) return;
    setIsLoading(true);
    // شبیه‌سازی (بعدا با useSendOtpMutation جایگزین می‌شود)
    setTimeout(() => {
      setIsLoading(false);
      setStep("OTP_VERIFY");
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    console.log("Verifying OTP:", otp.join(""));

    setTimeout(() => {
      setIsLoading(false);
      setStep("REGISTER_DETAILS");
    }, 1500);
  };

  useEffect(() => {
    if (otp.every((digit) => digit !== "") && otp.length === 5) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handlePasswordLogin = (e: React.FormEvent) => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleRegisterComplete = (formData: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    console.log("Registration data:", formData);
    alert("ثبت نام تکمیل شد و وارد شدید!");
  };

  // --- UI Helpers ---
  const getHeaderTitle = () => {
    switch (step) {
      case "REGISTER_DETAILS":
        return "تکمیل ثبت نام";
      case "OTP_VERIFY":
        return "تایید شماره موبایل";
      default:
        return "ورود به حساب";
    }
  };

  const getHeaderSubtitle = () => {
    switch (step) {
      case "OTP_VERIFY":
        return `کد ۵ رقمی ارسال شده به ${mobile} را وارد کنید`;
      case "REGISTER_DETAILS":
        return "لطفا اطلاعات زیر را برای ایجاد حساب تکمیل کنید";
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
        {/* --- LEFT SIDE: FORMS CONTAINER --- */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          <div className="mb-8">
            <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl mb-6 lg:hidden">
              A
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {getHeaderTitle()}
            </h1>
            <p className="text-gray-500 text-sm">{getHeaderSubtitle()}</p>
          </div>

          {/* Conditional Rendering of Steps */}
          {step === "MOBILE_ENTRY" && (
            <MobileEntryForm
              mobile={mobile}
              setMobile={setMobile}
              onSubmit={handleSendOtp}
              isLoading={isLoading}
              onSwitchToPassword={() => setStep("PASSWORD_LOGIN")}
            />
          )}

          {step === "PASSWORD_LOGIN" && (
            <PasswordLoginForm
              onSubmit={handlePasswordLogin}
              isLoading={isLoading}
              onBack={() => setStep("MOBILE_ENTRY")}
            />
          )}

          {step === "OTP_VERIFY" && (
            <OtpVerification
              otp={otp}
              setOtp={setOtp}
              isLoading={isLoading}
              onVerify={handleVerifyOtp}
              onBack={() => setStep("MOBILE_ENTRY")}
            />
          )}

          {step === "REGISTER_DETAILS" && (
            <RegisterDetailsForm onSubmit={handleRegisterComplete} />
          )}
        </div>

        {/* --- RIGHT SIDE: VISUAL --- */}
        <AuthBanner />
      </div>
    </div>
  );
};
