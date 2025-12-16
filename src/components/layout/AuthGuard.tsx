import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetProfileQuery } from "../../features/auth/authApi";
import { useAppSelector } from "../../app/hooks";

export const AuthGuard = () => {
  const location = useLocation();

  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const {
    isLoading: isQueryLoading,
    isError,
    isSuccess,
  } = useGetProfileQuery(undefined, {
    skip: isAuthenticated,
  });

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

  if (
    (isError && !isAuthenticated) ||
    (!isQueryLoading && !isAuthenticated && !isSuccess)
  ) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated || isSuccess) {
    return <Outlet />;
  }

  return null;
};
