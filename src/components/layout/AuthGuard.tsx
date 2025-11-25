import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../features/auth/authApi";
import { useAppSelector } from "../../app/hooks"; // هوکی که در مرحله قبل ساختیم

export const AuthGuard = () => {
  const location = useLocation();

  // ۱. خواندن وضعیت فعلی از ریداکس
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // ۲. تلاش برای گرفتن پروفایل (اگر صفحه رفرش شده باشد، این درخواست حیاتی است)
  // نکته: RTK Query هوشمند است؛ اگر دیتا در کش باشد، دوباره درخواست نمی‌زند.
  const {
    isLoading: isQueryLoading,
    isError,
    isSuccess,
  } = useGetProfileQuery(undefined, {
    // اگر کاربر در ریداکس لاگین است، لازم نیست بلافاصله دوباره چک کنیم (Performance)
    skip: isAuthenticated,
  });

  // ۳. ترکیب وضعیت لودینگ (چه لودینگ اولیه باشد چه لودینگ درخواست API)
  // اگر هنوز نمی‌دانیم کاربر کیست، اسپینر نشان می‌دهیم
  if (isQueryLoading && !isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-600"></div>
          <span className="text-gray-500 font-medium">
            در حال اعتبارسنجی...
          </span>
        </div>
      </div>
    );
  }

  // ۴. شرط اخراج کاربر
  // اگر درخواست تمام شد و ارور داشتیم (401) و در ریداکس هم لاگین نیستیم
  if (
    (isError && !isAuthenticated) ||
    (!isQueryLoading && !isAuthenticated && !isSuccess)
  ) {
    // state={{ from: location }} باعث می‌شود بعد از لاگین، کاربر برگردد به همین صفحه‌ای که بود
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // ۵. شرط ورود (موفقیت)
  // اگر در ریداکس لاگین هستیم یا درخواست با موفقیت برگشت
  if (isAuthenticated || isSuccess) {
    return <Outlet />; // اجازه دسترسی به فرزندان (DashboardLayout و ...)
  }

  return null; // برای اطمینان (نباید به اینجا برسد)
};
