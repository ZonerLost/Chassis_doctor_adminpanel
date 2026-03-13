import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  MdPeople,
  MdPersonAdd,
  MdLogin,
  MdVerifiedUser,
  MdSchool,
  MdStar,
  MdRefresh,
  MdUploadFile,
  MdMenuBook,
  MdBuild,
  MdOutlineFilterAlt,
} from "react-icons/md";

import { useTheme } from "../contexts/ThemeContext";
import ActionBtn from "../components/dashboard/ActionBtn";
import KpiTiles from "../components/dashboard/KpiTiles";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import SystemHealth from "../components/dashboard/SystemHealth";
import {
  DASHBOARD_RANGE_OPTIONS,
  EMPTY_DASHBOARD_OVERVIEW,
  getDashboardOverview,
} from "../services/dashboard.service";

function formatRelativeTime(value) {
  if (!value) return "—";
  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return "—";

  const diffSeconds = Math.floor((Date.now() - timestamp) / 1000);

  if (diffSeconds < 60) return "just now";
  if (diffSeconds < 3600) return `${Math.floor(diffSeconds / 60)}m ago`;
  if (diffSeconds < 86400) return `${Math.floor(diffSeconds / 3600)}h ago`;
  if (diffSeconds < 604800) return `${Math.floor(diffSeconds / 86400)}d ago`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function DashboardFilters({ range, onRangeChange, onRefresh, loading, colors }) {
  return (
    <div
      className="rounded-2xl border p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      style={{
        backgroundColor: colors.bg2,
        borderColor: colors.ring,
      }}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-2">
          <MdOutlineFilterAlt style={{ color: colors.text2 }} />
          <div className="text-sm font-medium" style={{ color: colors.text }}>
            Dashboard Filters
          </div>
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          Switch the period to refresh KPIs, activity and charts from Supabase.
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="min-w-[210px]">
          <label
            htmlFor="dashboard-range"
            className="block text-xs mb-1"
            style={{ color: colors.text2 }}
          >
            Period
          </label>
          <select
            id="dashboard-range"
            value={range}
            onChange={(event) => onRangeChange(event.target.value)}
            className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none"
            style={{
              backgroundColor: colors.card || colors.hover,
              borderColor: colors.ring,
              color: colors.text,
            }}
          >
            {DASHBOARD_RANGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium min-w-[120px]"
            style={{
              backgroundColor: colors.hover,
              borderColor: colors.ring,
              color: colors.text,
              opacity: loading ? 0.7 : 1,
            }}
          >
            <MdRefresh className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing" : "Refresh"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, rightLabel, children, colors }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: colors.bg2,
        borderColor: colors.ring,
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <div className="text-sm" style={{ color: colors.text2 }}>
            {subtitle}
          </div>
          <div className="text-lg font-semibold" style={{ color: colors.text }}>
            {title}
          </div>
        </div>
        {rightLabel ? (
          <div className="text-xs whitespace-nowrap" style={{ color: colors.text2 }}>
            {rightLabel}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function EmptyState({ message, colors }) {
  return (
    <div
      className="rounded-2xl border p-6 text-sm"
      style={{
        backgroundColor: colors.bg2,
        borderColor: colors.ring,
        color: colors.text2,
      }}
    >
      {message}
    </div>
  );
}

function RecentUsersCard({ users = [], colors }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Recent Active Users
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          Latest logins
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-sm" style={{ color: colors.text2 }}>
          No recent users found.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const displayName = user.full_name || user.email || "User";

            return (
              <div
                key={user.id}
                className="flex items-center gap-3 rounded-xl p-3"
                style={{
                  backgroundColor: colors.card || colors.hover,
                  border: `1px solid ${colors.ring}`,
                }}
              >
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={displayName}
                    className="h-11 w-11 rounded-full object-cover shrink-0"
                  />
                ) : (
                  <div
                    className="h-11 w-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                    style={{
                      backgroundColor: colors.hover,
                      border: `1px solid ${colors.ring}`,
                      color: colors.text,
                    }}
                  >
                    {displayName.slice(0, 1).toUpperCase()}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div
                    className="text-sm font-medium truncate"
                    style={{ color: colors.text }}
                  >
                    {displayName}
                  </div>
                  <div className="text-xs truncate" style={{ color: colors.text2 }}>
                    {user.email || "No email"}
                  </div>
                </div>

                <div className="text-[11px] whitespace-nowrap" style={{ color: colors.text2 }}>
                  {formatRelativeTime(user.last_login_at || user.created_at)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CourseGalleryCard({ courses = [], colors }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Recent Published Courses
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          Using DB thumbnails
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="text-sm" style={{ color: colors.text2 }}>
          No published courses found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl overflow-hidden border"
              style={{
                backgroundColor: colors.card || colors.hover,
                borderColor: colors.ring,
              }}
            >
              <div className="aspect-[16/10] overflow-hidden">
                {course.thumbnail_url ? (
                  <img
                    src={course.thumbnail_url}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full flex items-center justify-center text-sm"
                    style={{
                      backgroundColor: colors.hover,
                      color: colors.text2,
                    }}
                  >
                    No thumbnail
                  </div>
                )}
              </div>

              <div className="p-3">
                <div
                  className="text-sm font-semibold line-clamp-1"
                  style={{ color: colors.text }}
                >
                  {course.title}
                </div>

                <div className="mt-1 text-xs line-clamp-2" style={{ color: colors.text2 }}>
                  {course.category || "General"} • {course.level || "—"} •{" "}
                  {course.duration_minutes || 0} min
                </div>

                <div className="mt-2 text-[11px]" style={{ color: colors.text2 }}>
                  Published {course.created_label}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickActionsCard({ colors }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="text-sm font-semibold mb-4" style={{ color: colors.text }}>
        Quick Actions
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionBtn to="/courses/new" icon={MdUploadFile} label="Upload Coaching" />
        <ActionBtn to="/courses" icon={MdMenuBook} label="View Courses" />
        <ActionBtn to="/users" icon={MdPeople} label="Manage Users" />
        <ActionBtn to="/chassis-doctor" icon={MdBuild} label="Open Chassis Doctor" />
      </div>
    </div>
  );
}

export default function MainDashboard() {
  const { colors } = useTheme();

  const [range, setRange] = useState("30d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(EMPTY_DASHBOARD_OVERVIEW);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getDashboardOverview({ range });
      setDashboard(result);
    } catch (err) {
      setError(err?.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, [range]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const kpiItems = useMemo(
    () => [
      {
        key: "total-users",
        label: "Total Users",
        value: dashboard.summary.totalUsers,
        icon: MdPeople,
      },
      {
        key: "new-signups",
        label: "New Signups",
        value: dashboard.summary.newSignups,
        change: dashboard.changes.newSignups,
        icon: MdPersonAdd,
      },
      {
        key: "logins",
        label: "Logins",
        value: dashboard.summary.logins,
        change: dashboard.changes.logins,
        icon: MdLogin,
      },
      {
        key: "active-users",
        label: "Active Users",
        value: dashboard.summary.activeUsers,
        icon: MdVerifiedUser,
      },
      {
        key: "enrollments",
        label: "Enrollments",
        value: dashboard.summary.enrollments,
        change: dashboard.changes.enrollments,
        icon: MdSchool,
      },
      {
        key: "avg-rating",
        label: "Avg Rating",
        value: dashboard.summary.avgRating,
        suffix: "",
        icon: MdStar,
      },
    ],
    [dashboard]
  );

  const chartTooltipStyle = {
    background: colors.card || "#0F1118",
    border: `1px solid ${colors.ring}`,
    borderRadius: 12,
    color: colors.text,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: colors.text }}
          >
            Dashboard
          </h1>
          <div className="text-sm mt-1" style={{ color: colors.text2 }}>
            Real-time overview from users, courses, reviews, enrollments and chassis symptoms.
          </div>
        </div>

        <div className="text-sm md:text-right" style={{ color: colors.text2 }}>
          <div>{dashboard.rangeLabel || "Overview"}</div>
          <div className="mt-1">
            {dashboard.lastUpdatedAt
              ? `Updated ${formatRelativeTime(dashboard.lastUpdatedAt)}`
              : "Waiting for data"}
          </div>
        </div>
      </div>

      <DashboardFilters
        range={range}
        onRangeChange={setRange}
        onRefresh={loadDashboard}
        loading={loading}
        colors={colors}
      />

      {error ? <EmptyState message={error} colors={colors} /> : null}

      <KpiTiles items={kpiItems} loading={loading} />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartCard
            title="User growth vs logins"
            subtitle="New signups and login activity"
            rightLabel={dashboard.rangeLabel}
            colors={colors}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={dashboard.charts.userGrowth}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis dataKey="label" tick={{ fill: colors.text2, fontSize: 12 }} />
                  <YAxis tick={{ fill: colors.text2, fontSize: 12 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ color: colors.text2 }} />
                  <Bar
                    dataKey="signups"
                    name="Signups"
                    fill={colors.gold || "#EAB308"}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={28}
                  />
                  <Line
                    type="monotone"
                    dataKey="logins"
                    name="Logins"
                    stroke={colors.accent}
                    strokeWidth={3}
                    dot={{ r: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <div className="space-y-6">
          <RecentUsersCard users={dashboard.recentUsers} colors={colors} />
          <QuickActionsCard colors={colors} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ChartCard
            title="Enrollments, completions and reviews"
            subtitle="Course performance"
            rightLabel={dashboard.rangeLabel}
            colors={colors}
          >
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dashboard.charts.coursePerformance}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.05)"
                    vertical={false}
                  />
                  <XAxis dataKey="label" tick={{ fill: colors.text2, fontSize: 12 }} />
                  <YAxis tick={{ fill: colors.text2, fontSize: 12 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ color: colors.text2 }} />
                  <Bar
                    dataKey="enrollments"
                    name="Enrollments"
                    fill={colors.accent}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  />
                  <Bar
                    dataKey="completions"
                    name="Completions"
                    fill={colors.gold || "#EAB308"}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  />
                  <Line
                    type="monotone"
                    dataKey="reviews"
                    name="Reviews"
                    stroke={colors.purple || "#8B5CF6"}
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>
        </div>

        <ActivityFeed items={dashboard.recentActivity} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CourseGalleryCard courses={dashboard.recentCourses} colors={colors} />
        <SystemHealth items={dashboard.health} />
      </div>
    </div>
  );
}