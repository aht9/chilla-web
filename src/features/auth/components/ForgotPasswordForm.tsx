import { clsx } from "clsx";
import { useState } from "react";
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
  const [errors, setErrors] = useState<
    Array<{ message: string; isValid: boolean }>
  >([]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const hasError = errors.some((e) => !e.isValid);
    if (hasError) {
      return;
    }

    setErrors([]);
    onSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMobile(value);
    const trimmed = value.trim();
    if (trimmed === "") {
      setErrors([]);
    } else {
      const startsWith09 = trimmed.startsWith("09");
      const is11Digits = /^\d{11}$/.test(trimmed);
      const newErrors = [
        { message: "شماره باید با 09 شروع شود", isValid: startsWith09 },
        { message: "شماره باید ۱۱ رقم باشد", isValid: is11Digits },
      ];
      setErrors(newErrors);
    }
  };

  const hasError = errors.some((e) => !e.isValid);

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
              hasError ? "text-red-500" : "text-gray-400"
            )}
          />
          <input
            type="tel"
            value={mobile}
            onChange={handleChange}
            placeholder="0912..."
            maxLength={11}
            className={clsx(
              "w-full h-12 pr-10 pl-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white",
              hasError
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent"
            )}
            autoFocus
          />
        </div>

        {errors.map((err, idx) => (
          <p
            key={idx}
            className={clsx(
              "text-xs font-medium animate-pulse",
              err.isValid ? "text-green-500" : "text-red-500"
            )}
          >
            {err.message}
          </p>
        ))}
      </div>

      <button
        disabled={isLoading || mobile.trim() === "" || hasError}
        className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
