import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAdminSession from "../hooks/useAdminSession";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { loading, admin } = useAdminSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!admin) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;