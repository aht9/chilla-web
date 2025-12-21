import { useState } from "react";
import { clsx } from "clsx";
import { z } from "zod";
import { AlertCircle, Lock, User, Mail } from "lucide-react";

interface InputFieldProps {
  name: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
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
        value={value}
        onChange={onChange}
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
      e.preventDefault();
    }
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const newErrors: any = {};
      result.error.issues.forEach((issue) => {
        newErrors[issue.path[0]] = issue.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
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
