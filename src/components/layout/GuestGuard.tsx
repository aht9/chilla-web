import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
export const GuestGuard = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
