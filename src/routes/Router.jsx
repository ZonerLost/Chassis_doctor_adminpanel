// src/router/index.jsx
import React, { Suspense } from "react";
import { createBrowserRouter, Link } from "react-router-dom";
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
  return (
    <div
      className="flex items-center justify-center p-8"
      style={{ color: "inherit" }}
    >
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2"
        style={{ borderColor: "#D4AF37" }}
      />
      <span className="ml-3">Loading...</span>
    </div>
  );
};

// Lazy-load components
const UsersManagement = React.lazy(() =>
  import("../Pages/Auth/UserManagement.jsx").catch(() => ({
    default: () => <FailedToLoadUsersPage />,
  }))
);

const ChassisDoctorManagement = React.lazy(() =>
  import("../Pages/Auth/ChassisDoctorManagement.jsx").catch(() => ({
    default: () => <FailedToLoadChassisDoctorPage />,
  }))
);

const CoursesManagement = React.lazy(() =>
  import("../Pages/CoursesManagement.jsx").catch(() => ({
    default: () => <FailedToLoadCoursesPage />,
  }))
);

// Knowledge module (lazy)
const FailedToLoadKnowledgePage = () => (
  <div style={{ padding: 12 }}>Failed to load Knowledge page</div>
);
const KnowledgeManagement = React.lazy(() =>
  import("../Pages/KnowledgeBaseManagement.jsx").catch(() => ({
    default: () => <FailedToLoadKnowledgePage />,
  }))
);

// New: Analytics module (lazy)
const FailedToLoadAnalyticsPage = () => (
  <div style={{ padding: 12 }}>Failed to load Analytics page</div>
);
const AnalyticsReporting = React.lazy(() =>
  import("../Pages/Auth/AnalyticsReporting.jsx").catch(() => ({
    default: () => <FailedToLoadAnalyticsPage />,
  }))
);

// add lazy import for settings
const FailedToLoadSettingsPage = () => (
  <div style={{ padding: 12 }}>Failed to load Settings page</div>
);
const SettingsManagement = React.lazy(() =>
  import("../Pages/SettingsManagement.jsx").catch(() => ({
    default: () => <FailedToLoadSettingsPage />,
  }))
);

// removed broken lazy import for LiveEventsPage (file doesn't exist)
// define a local LiveEventsPage component instead
const LiveEventsPage = () => {
  const { colors } = useTheme();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
        Live & Events
      </h1>
      <p style={{ color: colors.text2 }}>Manage live events and schedules.</p>
    </div>
  );
};

// Fallback components for lazy loading errors
const FailedToLoadUsersPage = () => (
  <div style={{ padding: 12 }}>Failed to load Users page</div>
);
const FailedToLoadChassisDoctorPage = () => (
  <div style={{ padding: 12 }}>Failed to load Chassis Doctor page</div>
);
const FailedToLoadCoursesPage = () => (
  <div style={{ padding: 12 }}>Failed to load Courses page</div>
);
const FailedToLoadLiveEventsPage = () => (
  <div style={{ padding: 12 }}>Failed to load Live Events page</div>
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

// Dashboard component with theme context
const DashboardPageWithTheme = () => {
  const { colors } = useTheme();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
        Dashboard
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          className="p-4 rounded-xl border transition-colors duration-300"
          style={{
            backgroundColor: colors.bg2,
            borderColor: colors.ring,
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
            Total Users
          </h3>
          <p className="text-2xl font-bold" style={{ color: colors.accent }}>
            1,247
          </p>
        </div>
        <div
          className="p-4 rounded-xl border transition-colors duration-300"
          style={{
            backgroundColor: colors.bg2,
            borderColor: colors.ring,
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
            Active Sessions
          </h3>
          <p className="text-2xl font-bold" style={{ color: colors.accent }}>
            342
          </p>
        </div>
        <div
          className="p-4 rounded-xl border transition-colors duration-300"
          style={{
            backgroundColor: colors.bg2,
            borderColor: colors.ring,
          }}
        >
          <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
            Chassis Diagnostics
          </h3>
          <p className="text-2xl font-bold" style={{ color: colors.accent }}>
            89
          </p>
        </div>
      </div>
    </div>
  );
};

// Other page components with proper theming
const DealsPage = () => {
  const { colors } = useTheme();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
        Deals & Partners
      </h1>
      <p style={{ color: colors.text2 }}>
        Manage promotional deals and partnerships.
      </p>
    </div>
  );
};

const MessagingPage = () => {
  const { colors } = useTheme();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
        Messaging & Community
      </h1>
      <p style={{ color: colors.text2 }}>
        Manage communications and community features.
      </p>
    </div>
  );
};

const SupportPage = () => {
  const { colors } = useTheme();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
        Support / Media / Settings
      </h1>
      <p style={{ color: colors.text2 }}>
        System configuration and support tools.
      </p>
    </div>
  );
};

// add lazy login page
const LoginPage = React.lazy(() =>
  import("../Pages/Auth/Login.jsx").catch(() => ({
    default: () => <div style={{ padding: 12 }}>Failed to load Login page</div>,
  }))
);

const Router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <MainDashboard /> },
      {
        path: "users-memberships",
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <UsersManagement />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: "chassis-doctor",
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <ChassisDoctorManagement />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: "courses",
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <CoursesManagement />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: "knowledge",
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <KnowledgeManagement />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: "analytics",
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <AnalyticsReporting />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      {
        path: "settings",
        element: (
          <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
              <SettingsManagement />
            </Suspense>
          </ErrorBoundary>
        ),
      },
      // profile/system routes removed
      // brokers route removed
      // removed messaging & support-settings routes per request
    ],
  },
]);

export default Router;
