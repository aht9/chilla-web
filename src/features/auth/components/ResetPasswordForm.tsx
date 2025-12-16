import clsx from "clsx";
import { ArrowLeft, KeyRound } from "lucide-react";
import { useRef } from "react";

interface ResetPasswordFormProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const ResetPasswordForm = ({
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  onSubmit,
  isLoading,
  onBack,
}: ResetPasswordFormProps) => {
  // استفاده مجدد از کامپوننت OTP Verification یا پیاده‌سازی لاجیک OTP در همینجا
  // برای سادگی و یکپارچگی، بخش OTP را اینجا بازسازی می‌کنم اما می‌توانستیم کامپوننت کنیم.
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    if (element.value && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-6 animate-fade-in"
    >
      {/* 1. OTP Section */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 block text-center mb-2">
          کد تایید ۵ رقمی را وارد کنید
        </label>
        <div className="flex justify-center gap-2" dir="ltr">
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
                "w-12 h-12 border-2 rounded-lg text-center text-xl font-bold outline-none transition-all",
                data
                  ? "border-black bg-white"
                  : "border-gray-200 bg-gray-50 focus:border-gray-400"
              )}
            />
          ))}
        </div>
      </div>

      {/* 2. New Password Section */}
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            رمز عبور جدید
          </label>
          <div className="relative">
            <KeyRound className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <KeyRound className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="•••••••"
              className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            تکرار رمز عبور جدید
          </label>
          <div className="relative">
            <KeyRound className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="•••••••"
              className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50"
            />
          </div>
        </div>
      </div>

      <button
        disabled={isLoading}
        className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? "در حال ثبت تغییرات..." : "تغییر رمز عبور"}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-500 hover:text-black flex items-center justify-center gap-2 mt-4"
      >
        <ArrowLeft className="w-4 h-4" /> بازگشت
      </button>
    </form>
  );
};
