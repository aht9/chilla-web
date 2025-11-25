import React, { useState, useRef, useEffect } from "react";
import {
  Smartphone,
  Lock,
  User,
  Mail,
  ArrowLeft,
  Github,
  Chrome, // For Google Icon representation
  Facebook,
} from "lucide-react";
import { clsx } from "clsx";

// --- Types ---
type AuthStep =
  | "MOBILE_ENTRY"
  | "OTP_VERIFY"
  | "REGISTER_DETAILS"
  | "PASSWORD_LOGIN";

export const AuthPage = () => {
  // مدیریت مراحل و حالت‌ها
  const [step, setStep] = useState<AuthStep>("MOBILE_ENTRY");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>(new Array(5).fill(""));
  const [isLoading, setIsLoading] = useState(false);

  // رفرنس برای اینپوت‌های OTP جهت فوکوس خودکار
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // --- Logic: OTP Handling ---
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // فوکوس به خانه بعدی
    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    // بازگشت به خانه قبلی با Backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    setIsLoading(true);
    console.log("Verifying OTP:", otp.join(""));

    setTimeout(() => {
      setIsLoading(false);
      // فرض: اگر کاربر جدید باشد به تکمیل اطلاعات می‌رود
      // اگر کاربر قدیمی باشد لاگین می‌شود
      // اینجا برای دمو به صفحه تکمیل ثبت نام می‌رویم
      setStep("REGISTER_DETAILS");
    }, 1500);
  };

  // ارسال خودکار وقتی هر 5 خانه پر شد
  useEffect(() => {
    if (otp.every((digit) => digit !== "") && otp.length === 5) {
      handleVerifyOtp();
    }
  }, [otp]);

  // --- API Simulation Functions ---

  const handleSendOtp = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (mobile.length < 10) return;
    setIsLoading(true);
    // شبیه‌سازی درخواست سرور
    setTimeout(() => {
      setIsLoading(false);
      setStep("OTP_VERIFY");
    }, 1000);
  };

  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  const handleRegisterComplete = (e: React.FormEvent) => {
    e.preventDefault();
    alert("ثبت نام تکمیل شد و وارد شدید!");
  };

  // --- Components for Right Side (Visual) ---
  const RightSideVisual = () => (
    <div className="hidden lg:flex flex-col justify-between bg-black text-white w-1/2 p-12 m-4 rounded-[40px] relative overflow-hidden">
      {/* Abstract Background Effect */}
      <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-gray-700 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-900 rounded-full blur-[120px]"></div>
      </div>

      <div className="z-10">
        <div className="flex items-center gap-2 mb-20">
          {/* Logo Placeholder */}
          <div className="w-10 h-10 bg-gradient-to-tr from-gray-700 to-gray-900 rounded-lg flex items-center justify-center font-bold text-xl">
            A
          </div>
          <span className="font-bold text-xl tracking-wider">Arcana</span>
        </div>

        {/* 3D Abstract Triangle (CSS shape approximation) */}
        <div className="flex justify-center mb-10">
          <div className="relative w-48 h-48">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-700 to-black transform rotate-45 rounded-xl opacity-80 border border-gray-600"></div>
            <div className="absolute inset-4 bg-black transform rotate-45 rounded-xl border border-gray-800 flex items-center justify-center">
              <span className="text-6xl font-black text-gray-800">A</span>
            </div>
          </div>
        </div>

        <h2 className="text-4xl font-bold mb-4">خوش آمدید به آرکانا</h2>
        <p className="text-gray-400 leading-relaxed max-w-md">
          آرکانا به توسعه‌دهندگان کمک می‌کند تا داشبوردهای سازمان‌یافته و با
          کدنویسی تمیز بسازند. به بیش از ۱۷ هزار کاربر بپیوندید.
        </p>
      </div>

      {/* Bottom Card */}
      <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-3xl border border-gray-700 z-10 relative mt-8">
        <h3 className="text-xl font-bold mb-2">
          شغل و جایگاه مناسب خود را پیدا کنید
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          جز اولین نفراتی باشید که ساده‌ترین راه راه‌اندازی کسب‌وکار را تجربه
          می‌کنند.
        </p>
        <div className="flex -space-x-2 space-x-reverse">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-gray-500 border-2 border-gray-800"
            ></div>
          ))}
          <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-xs text-white">
            +2
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-0 lg:p-0 font-sans"
      dir="rtl"
    >
      <div className="w-full max-w-[1600px] h-screen lg:h-auto lg:min-h-[900px] bg-white lg:rounded-[50px] shadow-2xl flex overflow-hidden">
        {/* --- LEFT SIDE: FORMS --- */}
        <div className="w-full lg:w-1/2 p-8 md:p-16 flex flex-col justify-center relative">
          <div className="mb-8">
            <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center font-bold text-xl mb-6 lg:hidden">
              A
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {step === "REGISTER_DETAILS"
                ? "تکمیل ثبت نام"
                : step === "OTP_VERIFY"
                ? "تایید شماره موبایل"
                : "ورود به حساب"}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === "OTP_VERIFY"
                ? `کد ۵ رقمی ارسال شده به ${mobile} را وارد کنید`
                : step === "REGISTER_DETAILS"
                ? "لطفا اطلاعات زیر را برای ایجاد حساب تکمیل کنید"
                : "برای استفاده از امکانات لطفا وارد شوید"}
            </p>
          </div>

          {/* --- STEP 1: MOBILE ENTRY (Default) --- */}
          {step === "MOBILE_ENTRY" && (
            <form
              onSubmit={handleSendOtp}
              className="space-y-6 animate-fade-in"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  شماره موبایل
                </label>
                <div className="relative">
                  <Smartphone className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="0912..."
                    className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white"
                    autoFocus
                  />
                </div>
              </div>

              <button
                disabled={isLoading || mobile.length < 10}
                className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  "دریافت کد تایید"
                )}
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">
                  یا ورود با
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Social & Password Toggle */}
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                >
                  <Chrome className="w-5 h-5 text-gray-600" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-full border border-gray-200 hover:bg-gray-50 transition"
                >
                  <Github className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => setStep("PASSWORD_LOGIN")}
                  className="text-sm font-bold text-gray-900 hover:underline"
                >
                  ورود با نام کاربری و رمز عبور
                </button>
              </div>
            </form>
          )}

          {/* --- STEP 1-ALT: PASSWORD LOGIN --- */}
          {step === "PASSWORD_LOGIN" && (
            <form
              onSubmit={handlePasswordLogin}
              className="space-y-6 animate-fade-in"
            >
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    نام کاربری / ایمیل
                  </label>
                  <div className="relative">
                    <User className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="example@mail.com"
                      className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    رمز عبور
                  </label>
                  <div className="relative">
                    <Lock className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                    <input
                      type="password"
                      placeholder="•••••••"
                      className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <span className="text-sm text-gray-500">
                    مرا به خاطر بسپار
                  </span>
                </label>
                <a href="#" className="text-sm text-gray-500 hover:text-black">
                  رمز را فراموش کرده‌اید؟
                </a>
              </div>

              <button
                disabled={isLoading}
                className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                {isLoading ? "در حال ورود..." : "ورود"}
              </button>

              <button
                type="button"
                onClick={() => setStep("MOBILE_ENTRY")}
                className="w-full text-sm text-gray-500 hover:text-black flex items-center justify-center gap-2 mt-4"
              >
                <ArrowLeft className="w-4 h-4" /> بازگشت به ورود با موبایل
              </button>
            </form>
          )}

          {/* --- STEP 2: OTP VERIFY (5 SQUARES) --- */}
          {step === "OTP_VERIFY" && (
            <div className="animate-fade-in">
              <div className="flex justify-between gap-3 mb-8" dir="ltr">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpInputRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className={clsx(
                      "w-14 h-14 border-2 rounded-xl text-center text-2xl font-bold outline-none transition-all",
                      data
                        ? "border-black bg-white"
                        : "border-gray-200 bg-gray-50 focus:border-gray-400"
                    )}
                  />
                ))}
              </div>

              <div className="text-center space-y-4">
                {isLoading ? (
                  <div className="flex justify-center text-black font-medium items-center gap-2">
                    <span className="animate-spin w-5 h-5 border-2 border-black border-t-transparent rounded-full" />
                    در حال بررسی کد...
                  </div>
                ) : (
                  <button
                    onClick={handleVerifyOtp}
                    className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
                  >
                    تایید کد
                  </button>
                )}

                <button
                  onClick={() => setStep("MOBILE_ENTRY")}
                  className="text-sm text-gray-500 hover:text-black"
                >
                  اصلاح شماره موبایل
                </button>
              </div>
            </div>
          )}

          {/* --- STEP 3: REGISTER DETAILS --- */}
          {step === "REGISTER_DETAILS" && (
            <form
              onSubmit={handleRegisterComplete}
              className="space-y-4 animate-fade-in"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    نام
                  </label>
                  <input className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-2">
                    نام خانوادگی
                  </label>
                  <input className="w-full h-12 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  نام کاربری (انگلیسی)
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    dir="ltr"
                    className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  ایمیل
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    dir="ltr"
                    className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  رمز عبور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
                  <input
                    type="password"
                    dir="ltr"
                    className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50"
                  />
                </div>
              </div>

              <button className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 mt-4 shadow-lg shadow-gray-200">
                تکمیل و ورود به داشبورد
              </button>
            </form>
          )}
        </div>

        {/* --- RIGHT SIDE: VISUAL (DESKTOP) --- */}
        <RightSideVisual />
      </div>
    </div>
  );
};
