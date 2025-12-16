import { useState } from "react";
import { z } from "zod";
import { clsx } from "clsx";
import { Smartphone, ArrowLeft } from "lucide-react";

interface ForgotPasswordFormProps {
  mobile: string;
  setMobile: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const ForgotPasswordForm = ({
  mobile,
  setMobile,
  onSubmit,
  isLoading,
  onBack,
}: ForgotPasswordFormProps) => {
  const [error, setError] = useState<string | null>(null);

  // validation schema (same as mobile entry)
  const mobileSchema = z
    .string()
    .min(1, "لطفا شماره موبایل را وارد کنید")
    .regex(/^09[0-9]{9}$/, "شماره باید ۱۱ رقم و با 09 شروع شود");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const result = mobileSchema.safeParse(mobile);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }
    setError(null);
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          شماره موبایل جهت بازیابی رمز عبور
        </label>
        <div className="relative">
          <Smartphone
            className={clsx(
              "absolute right-3 top-3 w-5 h-5 transition-colors",
              error ? "text-red-500" : "text-gray-400"
            )}
          />
          <input
            type="tel"
            value={mobile}
            onChange={(e) => {
              setMobile(e.target.value);
              if (error) setError(null);
            }}
            placeholder="0912..."
            maxLength={11}
            className={clsx(
              "w-full h-12 pr-10 pl-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white",
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black"
            )}
            autoFocus
          />
        </div>
        {error && (
          <p className="text-red-500 text-xs font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>

      <button
        disabled={isLoading}
        className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          "ارسال کد بازیابی"
        )}
      </button>

      <button
        type="button"
        onClick={onBack}
        className="w-full text-sm text-gray-500 hover:text-black flex items-center justify-center gap-2 mt-4"
      >
        <ArrowLeft className="w-4 h-4" /> بازگشت به ورود
      </button>
    </form>
  );
};
