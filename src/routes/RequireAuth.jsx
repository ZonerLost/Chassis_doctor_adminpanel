/*
 * Route guard that blocks unauthenticated access to protected admin screens.
 * Normalizes redirect behavior so session checks remain consistent across routes.
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAdminSession from "../hooks/useAdminSession";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner";

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const { loading, admin } = useAdminSession();

  // Delay route decisions until session bootstrap completes to avoid redirect flicker.
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!admin) {
    // Preserve intended destination so login can return users to the protected route.
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default RequireAuth;
