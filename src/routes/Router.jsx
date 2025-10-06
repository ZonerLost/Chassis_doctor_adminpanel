import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layouts/DashboardLayout";
import MainDashboard from "../Pages/Auth/MainDashboard.jsx";
import { useTheme } from "../contexts/ThemeContext";

// Error boundary component
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

// Loading component
const LoadingSpinner = () => {
  const { colors } = useTheme();
  return (
    <div className="flex items-center justify-center p-8" style={{ color: "inherit" }}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: colors.accent }} />
      <span className="ml-3">Loading...</span>
    </div>
  );
};

// Generic fallback for lazy loading errors
const FailedToLoad = ({ page }) => (
  <div style={{ padding: 12 }}>Failed to load {page} page</div>
);


// DRY helpers for lazy pages and wrappers
const lazyPage = (importer, page) =>
  React.lazy(() =>
    importer().catch(() => ({
      default: () => <FailedToLoad page={page} />,
    }))
  );

const renderLazy = (Comp) => (
  <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner />}>
      {React.createElement(Comp)}
    </Suspense>
  </ErrorBoundary>
);

// Register lazy pages
const UsersManagement = lazyPage(
  () => import("../Pages/Auth/UserManagement.jsx"),
  "Users"
);
const ChassisDoctorManagement = lazyPage(
  () => import("../Pages/Auth/ChassisDoctorManagement.jsx"),
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
  () => import("../Pages/Auth/AnalyticsReporting.jsx"),
  "Analytics"
);
const SettingsManagement = lazyPage(
  () => import("../Pages/SettingsManagement.jsx"),
  "Settings"
);

// Public pages
const LoginPage = lazyPage(
  () => import("../Pages/Auth/Login.jsx"),
  "Login"
);

// Error UI for router (shown for 404 / route errors)
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
  // Public route: Login
  { path: "/login", element: renderLazy(LoginPage) },
  {
    path: "/",
    element: <DashboardLayout />,
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
      ].map(([path, Comp]) => ({ path, element: renderLazy(Comp) })),
    ],
  },
]);

export default Router;
