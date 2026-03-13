/*
 * Route map definition for public and authenticated admin application paths.
 * Keeps navigation flow explicit and colocated with access-control boundaries.
 */

import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import MainDashboard from "../Pages/MainDashboard.jsx";
import LoginPage from "../Pages/Auth/Login.jsx";
import ForgotPasswordPage from "../Pages/Auth/ForgotPassword.jsx";
import ResetPasswordPage from "../Pages/Auth/ResetPassword.jsx";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner.jsx";
import RequireAuth from "./RequireAuth.jsx";
import PublicOnlyRoute from "./PublicOnlyRoute.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center">
          <h2>Something went wrong.</h2>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-4 px-4 py-2 rounded bg-yellow-500 text-black"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const FailedToLoad = ({ page }) => (
  <div style={{ padding: 12 }}>Failed to load {page} page</div>
);

const lazyPage = (importer, page) =>
  React.lazy(() =>
    importer().catch((error) => {
      console.error(`Failed to lazy-load ${page} page:`, error);

      return {
        default: () => <FailedToLoad page={page} />,
      };
    })
  );

const renderLazy = (LazyComp) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComp />
    </Suspense>
  </ErrorBoundary>
);

const UsersManagement = lazyPage(
  () => import("../Pages/UserManagement.jsx"),
  "Users"
);
const ChassisDoctorManagement = lazyPage(
  () => import("../Pages/ChassisDoctorManagement.jsx"),
  "Chassis Doctor"
);
const CoursesManagement = lazyPage(
  () => import("../Pages/CoursesManagement.jsx"),
  "Courses"
);
const KnowledgeManagement = lazyPage(
  () => import("../Pages/KnowledgeBaseManagement.jsx"),
  "Knowledge"
);
const AnalyticsReporting = lazyPage(
  () => import("../Pages/AnalyticsReporting.jsx"),
  "Analytics"
);
const SettingsManagement = lazyPage(
  () => import("../Pages/SettingsManagement.jsx"),
  "Settings"
);

const ErrorPage = ({ error }) => {
  return (
    <div className="p-8 text-center" style={{ color: "inherit" }}>
      <h2 className="text-2xl font-semibold mb-2">Page not found</h2>
      <p style={{ marginBottom: 16 }}>
        The page you're looking for doesn't exist or couldn't be loaded.
      </p>
      <div>
        <a
          href="/"
          className="px-4 py-2 rounded-xl border inline-block"
          style={{
            borderColor: "#444",
            backgroundColor: "#111",
            color: "#fff",
          }}
        >
          Go back home
        </a>
      </div>
      {error?.statusText || error?.message ? (
        <div className="mt-4 text-xs" style={{ color: "#999" }}>
          {error.statusText || error.message}
        </div>
      ) : null}
    </div>
  );
};

const Router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicOnlyRoute>
        <LoginPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <PublicOnlyRoute>
        <ForgotPasswordPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainDashboard /> },
      ...[
        ["users-memberships", UsersManagement],
        ["chassis-doctor", ChassisDoctorManagement],
        ["courses", CoursesManagement],
        ["knowledge", KnowledgeManagement],
        ["analytics", AnalyticsReporting],
        ["settings", SettingsManagement],
      ].map(([path, Comp]) => ({
        path,
        element: renderLazy(Comp),
      })),
    ],
  },
]);

export default Router;
