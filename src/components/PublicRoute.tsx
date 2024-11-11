import React from "react";
import { Navigate, RouteProps } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PublicRoute: React.FC<RouteProps> = ({ children }) => {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return <Navigate to="/todos" />;
  }

  return <>{children}</>;
};

export default PublicRoute;
