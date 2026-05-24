import { useAppSelector } from "@/hooks/redux";
import type { UserRole } from "@/types/User";
import { Navigate, Outlet, useLocation } from "react-router";

type ProtectedRouteProps = {
  allowedRoles?: UserRole[];
};

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { token, role } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/auth/sign-in" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
