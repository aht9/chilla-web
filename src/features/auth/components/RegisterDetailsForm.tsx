import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react"; // آیکون‌های جدید اضافه شدند
import { clsx } from "clsx";
import { z } from "zod";

// --- Validation Schema ---
const registerSchema = z.object({
  firstName: z.string().min(2, "نام باید حداقل ۲ حرف باشد"),
  lastName: z.string().min(2, "نام خانوادگی باید حداقل ۲ حرف باشد"),
  username: z.string().min(4, "نام کاربری باید حداقل ۴ حرف باشد"),
  // تغییر مهم: ایمیل اختیاری شد (یا رشته خالی یا فرمت صحیح ایمیل)
  email: z.union([z.literal(""), z.string().email("فرمت ایمیل صحیح نیست")]),
  password: z.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterDetailsFormProps {
  onSubmit: (data: RegisterFormData) => void;
  isLoading: boolean;
}

export const RegisterDetailsForm = ({
  onSubmit,
  isLoading,
}: RegisterDetailsFormProps) => {
  // --- States ---
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

  // استیت جدید برای نمایش/مخفی کردن رمز عبور
  const [showPassword, setShowPassword] = useState(false);

  // --- Handlers ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // پاک کردن ارور فیلد هنگام تایپ
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: any = {};
      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    // اگر ایمیل خالی بود، مقدار undefined ارسال شود (بسته به نیاز بک‌اند)
    // اما چون فرم شما استرینگ خالی می‌پذیرد، همین‌طور ارسال می‌کنیم.
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      {/* Row 1: Name & Family */}
      <div className="flex gap-4">
        <div className="w-1/2 space-y-2">
          <label className="text-sm font-medium text-gray-700">نام</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="مثال: علی"
            className={clsx(
              "w-full h-12 px-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white",
              errors.firstName
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black"
            )}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs">{errors.firstName}</p>
          )}
        </div>
        <div className="w-1/2 space-y-2">
          <label className="text-sm font-medium text-gray-700">
            نام خانوادگی
          </label>
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="مثال: محمدی"
            className={clsx(
              "w-full h-12 px-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white",
              errors.lastName
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black"
            )}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Row 2: Username */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">نام کاربری</label>
        <div className="relative">
          <User className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="نام کاربری انگلیسی (مانند ali_dev)"
            className={clsx(
              "w-full h-12 pr-10 pl-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white dir-ltr text-left", // dir-ltr added
              errors.username
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black"
            )}
          />
        </div>
        {errors.username && (
          <p className="text-red-500 text-xs">{errors.username}</p>
        )}
      </div>

      {/* Row 3: Email (Optional) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          ایمیل <span className="text-gray-400 text-xs">(اختیاری)</span>
        </label>
        <div className="relative">
          <Mail className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="example@mail.com"
            className={clsx(
              "w-full h-12 pr-10 pl-4 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white dir-ltr text-left",
              errors.email
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black"
            )}
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
      </div>

      {/* Row 4: Password (With Toggle) */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">رمز عبور</label>
        <div className="relative">
          {/* آیکون قفل سمت راست */}
          <Lock className="absolute right-3 top-3 text-gray-400 w-5 h-5" />

          <input
            name="password"
            type={showPassword ? "text" : "password"} // تغییر نوع اینپوت بر اساس استیت
            value={formData.password}
            onChange={handleChange}
            placeholder="•••••••"
            className={clsx(
              "w-full h-12 pr-10 pl-10 border rounded-xl outline-none transition-all bg-gray-50 hover:bg-white dir-ltr text-left",
              errors.password
                ? "border-red-500 focus:ring-2 focus:ring-red-200"
                : "border-gray-200 focus:ring-2 focus:ring-black"
            )}
          />

          {/* دکمه تغییر وضعیت نمایش رمز (سمت چپ) */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-3 text-gray-400 hover:text-black transition-colors focus:outline-none"
            tabIndex={-1} // برای اینکه با تب انتخاب نشود
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs">{errors.password}</p>
        )}
      </div>

      <button
        disabled={isLoading}
        className="w-full h-12 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-colors mt-6 flex items-center justify-center disabled:opacity-50"
      >
        {isLoading ? (
          <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
        ) : (
          "تکمیل ثبت نام و ورود"
        )}
      </button>
    </form>
  );
};
