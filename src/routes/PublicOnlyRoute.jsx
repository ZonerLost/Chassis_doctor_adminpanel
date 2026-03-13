/*
 * Route guard that prevents authenticated users from revisiting public auth screens.
 * Maintains a predictable sign-in flow by redirecting active sessions to app content.
 */

import React from "react";
import { Navigate } from "react-router-dom";
import useAdminSession from "../hooks/useAdminSession";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner";

const PublicOnlyRoute = ({ children }) => {
  const { loading, admin } = useAdminSession();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (admin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicOnlyRoute;