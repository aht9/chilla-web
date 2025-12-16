import { clsx } from "clsx";
import { useState } from "react";
import { z } from "zod";
import { Smartphone } from "lucide-react";

const mobileSchema = z
  .string()
  .min(1, "لطفا شماره موبایل را وارد کنید")
  .regex(/^09[0-9]{9}$/, "شماره باید ۱۱ رقم و با 09 شروع شود (مثلا 0912...)");

interface MobileEntryProps {
  mobile: string;
  setMobile: (val: string) => void;
  onSubmit: (e?: React.FormEvent) => void;
  isLoading: boolean;
  onSwitchToPassword: () => void;
}

export const MobileEntryForm = ({
  mobile,
  setMobile,
  onSubmit,
  isLoading,
  onSwitchToPassword,
}: MobileEntryProps) => {
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
          شماره موبایل
        </label>
        <div className="relative">
          <Smartphone
            className={clsx(
              "absolute right-3 top-3 w-5 h-5 transition-colors",
              hasError ? "text-red-500" : "text-gray-400" // تغییر رنگ آیکون در صورت خطا
            )}
          />

          <input
            type="tel"
            value={mobile}
            // هر بار که کاربر تایپ می‌کند، ولیدیشن را چک می‌کنیم
            onChange={(e) => handleChange(e)}
            placeholder="0912..."
            maxLength={11}
            className={clsx(
              "w-full h-12 pr-10 pl-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white",
              // لاجیک تغییر رنگ بردر (قرمز در صورت خطا، سیاه در فوکوس)
              hasError
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent"
            )}
            autoFocus
          />
        </div>

        {/* --- 5. نمایش پیام خطا --- */}
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
        disabled={isLoading || mobile.trim() === "" || hasError} // دکمه در صورت خالی بودن یا خطا غیرفعال شود
        className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          "دریافت کد تایید"
        )}
      </button>

      {/* ... بقیه بخش‌ها (خط جداکننده و دکمه‌های سوشال) ... */}
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={onSwitchToPassword}
          className="text-sm font-bold text-gray-900 hover:underline"
        >
          ورود با نام کاربری و رمز عبور
        </button>
      </div>
    </form>
  );
};
