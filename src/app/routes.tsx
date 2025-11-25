import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { GuestGuard } from "../components/layout/GuestGuard";
import { AuthGuard } from "../components/layout/AuthGuard";

// --- Lazy Loading (برای کاهش حجم باندل اولیه) ---
// صفحاتی که هنوز نساختیم را فعلا کامنت یا ساده می‌کنیم
const AuthPage = React.lazy(() =>
  import("../features/auth/AuthPage").then((module) => ({
    default: module.AuthPage,
  }))
);

// یک کامپوننت لودینگ ساده برای زمانی که صفحه در حال دانلود است
const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    // --- مسیرهای عمومی (Public) ---
    path: "/",
    element: <Navigate to="/auth/login" replace />, // ریدایرکت پیش‌فرض به لاگین
  },
  {
    path: "auth",
    element: <GuestGuard />, // محافظت: اگر لاگین بود نیاید اینجا
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "login",
            element: (
              <Suspense fallback={<LoadingScreen />}>
                <AuthPage />
              </Suspense>
            ),
          },
          // مسیر ثبت نام هم در همان AuthPage هندل شده (طبق طراحی شما)
          {
            path: "register",
            element: <Navigate to="/auth/login" replace />,
          },
        ],
      },
    ],
  },

  // --- مسیرهای خصوصی (Private / Dashboard) ---
  {
    path: "dashboard",
    element: <AuthGuard />, // محافظت: فقط اگر لاگین بود بیاید
    children: [
      {
        index: true,
        element: (
          <div className="p-10 text-center text-2xl">
            خوش آمدید به داشبورد (اینجا بعدا طراحی می‌شود)
          </div>
        ),
      },
    ],
  },

  // --- صفحه 404 ---
  {
    path: "*",
    element: (
      <div className="h-screen flex items-center justify-center text-xl">
        ۴۰۴ | صفحه یافت نشد
      </div>
    ),
  },
]);
