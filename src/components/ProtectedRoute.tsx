import React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute: React.FC<RouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
