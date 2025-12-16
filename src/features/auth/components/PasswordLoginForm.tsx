import { Lock, User, ArrowLeft } from "lucide-react";

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
