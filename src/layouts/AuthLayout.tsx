import { Outlet } from "react-router-dom";

export const AuthLayout = () => {
  return (
    <div className="w-full min-h-screen bg-gray-50 font-sans">
      {/* اینجا می‌توانیم هدر ساده یا فوتر کپی‌رایت بگذاریم */}
      <Outlet /> {/* صفحات لاگین و رجیستر اینجا رندر می‌شوند */}
    </div>
  );
};
