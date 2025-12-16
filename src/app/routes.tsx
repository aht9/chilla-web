import React, { Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AuthLayout } from "../layouts/AuthLayout";
import { GuestGuard } from "../components/layout/GuestGuard";
import { AuthGuard } from "../components/layout/AuthGuard";

const AuthPage = React.lazy(() =>
  import("../features/auth/AuthPage").then((module) => ({
    default: module.AuthPage,
  }))
);

const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "auth",
    element: <GuestGuard />,
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
          {
            path: "register",
            element: <Navigate to="/auth/login" replace />,
          },
        ],
      },
    ],
  },

  {
    path: "dashboard",
    element: <AuthGuard />,
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
