import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isTokenExpired, useAuthStore } from "@/store/authStore";
import type { Role } from "@/types/auth";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Role[];
}

export default function ProtectedRoute({
  children,
  requiredRoles,
}: ProtectedRouteProps) {
  const { accessToken, isAuthenticated, logout, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isTokenExpired(accessToken)) {
    logout();
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles && !requiredRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
