import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
export const GuestGuard = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // اگر کاربر لاگین است، او را به داشبورد بفرست
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // اگر لاگین نیست، اجازه بده صفحه لاگین را ببیند
  return <Outlet />;
};
