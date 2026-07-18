import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";
import type { UserRole } from "../types";

interface PrivateRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const PrivateRoute = ({ children, allowedRoles }: PrivateRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner message="בודק הרשאות..." />;

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;