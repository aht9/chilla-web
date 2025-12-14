import React, { useRef, useState, type FormEvent } from "react";
import {
  Smartphone,
  AlertCircle,
  Lock,
  User,
  Mail,
  ArrowLeft,
  KeyRound,
} from "lucide-react";
import { clsx } from "clsx";
import { z } from "zod";
import logoChilla from "../../assets/logo-chilla-login.svg";

const mobileSchema = z
  .string()
  .min(1, "لطفا شماره موبایل را وارد کنید")
  .regex(/^09[0-9]{9}$/, "شماره باید ۱۱ رقم و با 09 شروع شود (مثلا 0912...)");

export type AuthStep =
  | "MOBILE_ENTRY"
  | "OTP_VERIFY"
  | "REGISTER_DETAILS"
  | "PASSWORD_LOGIN"
  | "FORGOT_PASSWORD"
  | "RESET_PASSWORD";

//1-Right Side
export const AuthBanner = () => (
  <div className="hidden lg:flex flex-col justify-between bg-green-950 text-white w-1/2 p-12 m-4 rounded-[40px] relative overflow-hidden">
    {/* Abstract Background Effect */}
    <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-700 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-green-900 rounded-full blur-[120px]"></div>
    </div>

    <div className="z-10">
      <div className="flex items-center gap-2 mb-20">
        <div className="w-10 h-10 bg-gradient-to-tr from-white to-green-900 rounded-lg flex items-center justify-center font-bold text-xl">
          چ
        </div>
        <span className="font-bold text-م tracking-wider">
          تغییر، از همین چله آغاز می‌شود...
        </span>
      </div>

      <div className="flex justify-center mb-10">
        <img src={logoChilla} />
      </div>

      <h2 className="text-4xl font-bold mb-4">خوش آمدید به چله</h2>
      <p className="text-gray-400 leading-relaxed max-w-md">
        چله به توسعه‌دهندگان کمک می‌کند تا داشبوردهای سازمان‌یافته و با کدنویسی
        تمیز بسازند.
      </p>
    </div>

    {/* Bottom Card */}
    <div className="bg-gray-800/50 backdrop-blur-md p-6 rounded-3xl border border-gray-700 z-10 relative mt-8">
      <h3 className="text-xl font-bold mb-2">
        شغل و جایگاه مناسب خود را پیدا کنید
      </h3>
      <div className="flex -space-x-2 space-x-reverse mt-4">
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

// --- 2. Mobile Entry Form ---
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
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const result = mobileSchema.safeParse(mobile);

    if (!result.success) {
      // اگر خطا داشت، اولین پیام خطا را بگیر و در استیت بگذار
      const errorMessage = result.error.issues[0].message;
      setError(errorMessage);
      return;
    }

    setError(null); // ارورهای قبلی را پاک کن
    onSubmit(); // ✅ حالا تابع اصلی (ارسال به سرور) را صدا بزن
  };

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
              error ? "text-red-500" : "text-gray-400" // تغییر رنگ آیکون در صورت خطا
            )}
          />

          <input
            type="tel"
            value={mobile}
            // هر بار که کاربر تایپ می‌کند، اگر ارور داشت آن را پاک می‌کنیم (UX بهتر)
            onChange={(e) => {
              setMobile(e.target.value);
              if (error) setError(null);
            }}
            placeholder="0912..."
            maxLength={11}
            className={clsx(
              "w-full h-12 pr-10 pl-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white",
              // لاجیک تغییر رنگ بردر (قرمز در صورت خطا، سیاه در فوکوس)
              error
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent"
            )}
            autoFocus
          />
        </div>

        {/* --- 5. نمایش پیام خطا --- */}
        {error && (
          <p className="text-red-500 text-xs font-medium animate-pulse">
            {error}
          </p>
        )}
      </div>

      <button
        disabled={isLoading} // دیگر شرط mobile.length را اینجا نمی‌گذاریم، می‌سپاریم به دکمه
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

// --- 3. Password Login Form ---
interface PasswordLoginProps {
  username: string;
  setUsername: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onBack: () => void;
}

export const PasswordLoginForm = ({
  username,
  setUsername,
  password,
  setPassword,
  onSubmit,
  isLoading,
  onBack,
}: PasswordLoginProps) => (
  <form onSubmit={onSubmit} className="space-y-6 animate-fade-in">
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          نام کاربری
        </label>
        <div className="relative">
          <User className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="نام کاربری خود را وارد کنید"
            className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50 hover:bg-white transition-all"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="•••••••"
            className="w-full h-12 pr-10 pl-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black outline-none bg-gray-50 hover:bg-white transition-all"
          />
        </div>
      </div>
    </div>

    <button
      disabled={isLoading}
      className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center disabled:opacity-50"
    >
      {isLoading ? (
        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
      ) : (
        "ورود"
      )}
    </button>

    <button
      type="button"
      onClick={onBack}
      className="w-full text-sm text-gray-500 hover:text-black flex items-center justify-center gap-2 mt-4"
    >
      <ArrowLeft className="w-4 h-4" /> بازگشت به ورود با موبایل
    </button>
  </form>
);

// --- 4. OTP Verification Component ---
interface OtpVerificationProps {
  otp: string[];
  setOtp: (otp: string[]) => void;
  isLoading: boolean;
  onVerify: () => void;
  onBack: () => void;
}

export const OtpVerification = ({
  otp,
  setOtp,
  isLoading,
  onVerify,
  onBack,
}: OtpVerificationProps) => {
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
            onClick={onVerify}
            className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800"
          >
            تایید کد
          </button>
        )}

        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-black"
        >
          اصلاح شماره موبایل
        </button>
      </div>
    </div>
  );
};

// --- 5. Register Details Form ---

interface InputFieldProps {
  name: string;
  label: string;
  value: string; // مقدار را از پدر می‌گیرد
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // تابع تغییر را از پدر می‌گیرد
  error?: string; // ارور را از پدر می‌گیرد
  type?: string;
  icon?: any;
  dir?: "rtl" | "ltr";
}

const InputField = ({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  icon: Icon,
  dir = "rtl",
}: InputFieldProps) => (
  <div>
    <label className="text-sm font-medium text-gray-700 block mb-2">
      {label}
    </label>
    <div className="relative">
      {Icon && (
        <Icon
          className={clsx(
            "absolute right-3 top-3 w-5 h-5 transition-colors",
            error ? "text-red-500" : "text-gray-400"
          )}
        />
      )}
      <input
        type={type}
        name={name}
        value={value} // ✅ مقدار از پراپ می‌آید
        onChange={onChange} // ✅ هندلر از پراپ می‌آید
        dir={dir}
        className={clsx(
          "w-full h-12 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white",
          Icon ? "pr-10 pl-4" : "px-4",
          error
            ? "border-red-500 focus:ring-2 focus:ring-red-200"
            : "border-gray-200 focus:ring-2 focus:ring-black"
        )}
      />
    </div>
    {error && (
      <div className="flex items-center gap-1 mt-1 text-red-500 text-xs animate-pulse">
        <AlertCircle className="w-3 h-3" />
        <span>{error}</span>
      </div>
    )}
  </div>
);

const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "نام باید حداقل ۲ حرف باشد")
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "نام فقط باید شامل حروف فارسی یا انگلیسی باشد (بدون عدد و علامت)"
    ),

  lastName: z
    .string()
    .min(2, "نام خانوادگی باید حداقل ۲ حرف باشد")
    .regex(
      /^[a-zA-Z\u0600-\u06FF\s]+$/,
      "نام خانوادگی فقط باید شامل حروف فارسی یا انگلیسی باشد"
    ),

  username: z
    .string()
    .min(4, "نام کاربری باید حداقل ۴ کاراکتر باشد")
    .regex(
      /^[a-zA-Z][a-zA-Z0-9]*$/,
      "نام کاربری باید با حرف انگلیسی شروع شود و فقط شامل حروف و اعداد باشد"
    ),

  email: z
    .string()
    .email("لطفا یک ایمیل معتبر وارد کنید (مثلا user@example.com)"),

  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterDetailsProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading?: boolean;
}

export const RegisterDetailsForm = ({
  onSubmit,
  isLoading = false,
}: RegisterDetailsProps) => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterFormData, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault(); // Only call preventDefault if it's an event
    }
    // الف) اعتبارسنجی کل فرم
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      // ب) اگر خطا داشت، تبدیل فرمت Zod به فرمت ساده برای نمایش
      const newErrors: any = {};
      result.error.issues.forEach((issue) => {
        // path[0] نام فیلد است (مثلا email)
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    // ج) اگر موفق بود
    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        {/* حالا اینجا پراپ‌ها را پاس می‌دهیم.
                   چون InputField ثابت است و دوباره ساخته نمی‌شود،
                   فوکوس حفظ می‌شود. 
                */}
        <InputField
          name="firstName"
          label="نام"
          value={formData.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <InputField
          name="lastName"
          label="نام خانوادگی"
          value={formData.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
      </div>

      <InputField
        name="username"
        label="نام کاربری (انگلیسی)"
        value={formData.username}
        onChange={handleChange}
        error={errors.username}
        dir="ltr"
        icon={User}
      />

      <InputField
        name="email"
        label="ایمیل"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        type="email"
        dir="ltr"
        icon={Mail}
      />

      <InputField
        name="password"
        label="رمز عبور"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
        type="password"
        dir="ltr"
        icon={Lock}
      />

      <button
        disabled={isLoading}
        className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 mt-4 shadow-lg shadow-gray-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          "تکمیل و ورود به داشبورد"
        )}
      </button>
    </form>
  );
};

// ---------------------------------------------------------
// --- 6. Forgot Password Form ---
// ---------------------------------------------------------

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

// ---------------------------------------------------------
// --- 7. Reset Password Form (OTP + New Pass) ---
// ---------------------------------------------------------

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
