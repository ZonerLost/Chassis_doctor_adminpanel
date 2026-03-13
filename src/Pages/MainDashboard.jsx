/*
 * Page container for main dashboard workflows in the admin interface.
 * Composes feature hooks and presentational components at the route boundary.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  MdBuild,
  MdLogin,
  MdMenuBook,
  MdOutlineFilterAlt,
  MdPeople,
  MdPersonAdd,
  MdRefresh,
  MdSchool,
  MdStar,
  MdVerifiedUser,
} from "react-icons/md";
import ActionBtn from "../components/dashboard/ActionBtn";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import KpiTiles from "../components/dashboard/KpiTiles";
import SystemHealth from "../components/dashboard/SystemHealth";
import { useTheme } from "../contexts/ThemeContext";
import {
  DASHBOARD_RANGE_OPTIONS,
  EMPTY_DASHBOARD_OVERVIEW,
  getDashboardOverview,
} from "../services/dashboard.service";

function DashboardFilters({ range, onRangeChange, onRefresh, loading, colors }) {
  return (
    <div
      className="flex flex-col gap-4 rounded-2xl border p-4 lg:flex-row lg:items-center lg:justify-between"
      style={{
        backgroundColor: colors.bg2,
        borderColor: colors.ring,
      }}
    >
      <div className="min-w-0">
        <div className="mb-2 flex items-center gap-2">
          <MdOutlineFilterAlt style={{ color: colors.text2 }} />
          <div className="text-sm font-medium" style={{ color: colors.text }}>
            Dashboard Filters
          </div>
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          Switch the reporting window to refresh KPIs, charts, and recent activity.
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="min-w-[210px]">
          <label
            htmlFor="dashboard-range"
            className="mb-1 block text-xs"
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
            className="inline-flex min-h-[44px] min-w-[120px] items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium"
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

function PanelCard({ title, subtitle, rightLabel, colors, children }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: colors.bg2,
        borderColor: colors.ring,
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm" style={{ color: colors.text2 }}>
            {subtitle}
          </div>
          <div className="text-lg font-semibold" style={{ color: colors.text }}>
            {title}
          </div>
        </div>
        {rightLabel ? (
          <div className="whitespace-nowrap text-xs" style={{ color: colors.text2 }}>
            {rightLabel}
          </div>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function InlineNotice({ message, colors }) {
  return (
    <div
      className="rounded-2xl border px-4 py-3 text-sm"
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

function ChartFooterNote({ visible, message, colors }) {
  if (!visible) return null;

  return (
    <div className="mt-3 text-xs" style={{ color: colors.text2 }}>
      {message}
    </div>
  );
}

function RecentUsersCard({ users = [], rangeLabel = "", loading = false, colors }) {
  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Recent Active Users
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          {rangeLabel || "Latest logins"}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border p-3"
              style={{
                backgroundColor: colors.card || colors.hover,
                borderColor: colors.ring,
              }}
            >
              <div
                className="h-11 w-11 rounded-full"
                style={{ backgroundColor: colors.hover }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-4 w-32 rounded"
                  style={{ backgroundColor: colors.hover }}
                />
                <div
                  className="h-3 w-40 rounded"
                  style={{ backgroundColor: colors.hover }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-sm" style={{ color: colors.text2 }}>
          No user logins were found for this range.
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center gap-3 rounded-xl border p-3"
              style={{
                backgroundColor: colors.card || colors.hover,
                borderColor: colors.ring,
              }}
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.displayName}
                  className="h-11 w-11 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{
                    backgroundColor: colors.hover,
                    border: `1px solid ${colors.ring}`,
                    color: colors.text,
                  }}
                >
                  {user.avatarInitial}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div
                  className="truncate text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  {user.displayName}
                </div>
                <div className="truncate text-xs" style={{ color: colors.text2 }}>
                  {user.email || "No email"}
                </div>
              </div>

              <div className="whitespace-nowrap text-[11px]" style={{ color: colors.text2 }}>
                {user.lastSeenLabel}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CourseGalleryCard({
  courses = [],
  rangeLabel = "",
  loading = false,
  colors,
}) {
  const cardStyle = {
    backgroundColor: colors.card || colors.hover,
    borderColor: colors.ring,
  };

  const mediaFrameStyle = {
    backgroundColor: colors.hover,
    borderColor: colors.ring,
  };

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ backgroundColor: colors.bg2, borderColor: colors.ring }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-semibold" style={{ color: colors.text }}>
          Recent Published Courses
        </div>
        <div className="text-xs" style={{ color: colors.text2 }}>
          {rangeLabel || "Published courses"}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border p-3"
              style={cardStyle}
            >
              <div
                className="h-32 rounded-xl border sm:h-28 xl:h-24"
                style={mediaFrameStyle}
              />
              <div className="mt-3 space-y-2.5 px-0.5">
                <div
                  className="h-4 w-3/4 rounded"
                  style={{ backgroundColor: colors.hover }}
                />
                <div
                  className="h-3 w-full rounded"
                  style={{ backgroundColor: colors.hover }}
                />
                <div
                  className="h-3 w-24 rounded"
                  style={{ backgroundColor: colors.hover }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-sm" style={{ color: colors.text2 }}>
          No published courses were found for this range.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.id}
              className="rounded-2xl border p-3"
              style={cardStyle}
            >
              <div
                className="overflow-hidden rounded-xl border"
                style={mediaFrameStyle}
              >
                {course.thumbnailUrl ? (
                  <img
                    src={course.thumbnailUrl}
                    alt={course.title}
                    className="h-32 w-full object-cover sm:h-28 xl:h-24"
                  />
                ) : (
                  <div
                    className="flex h-32 w-full items-center justify-center text-sm sm:h-28 xl:h-24"
                    style={{ color: colors.text2 }}
                  >
                    No thumbnail
                  </div>
                )}
              </div>

              <div className="mt-3 space-y-2 px-0.5">
                <div
                  className="line-clamp-1 text-sm font-semibold leading-5"
                  style={{ color: colors.text }}
                >
                  {course.title}
                </div>

                <div
                  className="line-clamp-2 text-xs leading-5"
                  style={{ color: colors.text2 }}
                >
                  {course.metaLabel}
                </div>

                <div className="pt-0.5 text-[11px]" style={{ color: colors.text2 }}>
                  Published {course.createdLabel}
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
      <div className="mb-4 text-sm font-semibold" style={{ color: colors.text }}>
        Quick Actions
      </div>

      <div className="flex flex-wrap gap-3">
        <ActionBtn to="/courses" icon={MdMenuBook} label="Manage Courses" />
        <ActionBtn
          to="/users-memberships"
          icon={MdPeople}
          label="Manage Users"
        />
        <ActionBtn to="/knowledge" icon={MdMenuBook} label="Knowledge Base" />
        <ActionBtn
          to="/chassis-doctor"
          icon={MdBuild}
          label="Open Chassis Doctor"
        />
      </div>
    </div>
  );
}

export default function MainDashboard() {
  const { colors } = useTheme();

  const [range, setRange] = useState("12m");
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

  // Keep tile definitions derived from a single response payload to avoid duplicated UI state.
  const kpiItems = useMemo(
    () => [
      {
        key: "total-users",
        label: "Total Users",
        value: dashboard.summary.totalUsers,
        helperText: "All user accounts",
        icon: MdPeople,
      },
      {
        key: "new-signups",
        label: "New Signups",
        value: dashboard.summary.newSignups,
        change: dashboard.changes.newSignups,
        helperText: dashboard.rangeLabel,
        icon: MdPersonAdd,
      },
      {
        key: "logins",
        label: "Logins",
        value: dashboard.summary.logins,
        change: dashboard.changes.logins,
        helperText: dashboard.rangeLabel,
        icon: MdLogin,
      },
      {
        key: "active-users",
        label: "Active Users",
        value: dashboard.summary.activeUsers,
        helperText: "Users with active status",
        icon: MdVerifiedUser,
      },
      {
        key: "enrollments",
        label: "Enrollments",
        value: dashboard.summary.enrollments,
        change: dashboard.changes.enrollments,
        helperText: dashboard.rangeLabel,
        icon: MdSchool,
      },
      {
        key: "avg-rating",
        label: "Avg Rating",
        value: dashboard.summary.avgRating,
        decimals: 1,
        helperText: dashboard.rangeLabel,
        icon: MdStar,
      },
    ],
    [dashboard]
  );

  const userGrowthHasData = useMemo(
    () =>
      dashboard.charts.userGrowth.some(
        (point) => point.signups > 0 || point.logins > 0
      ),
    [dashboard.charts.userGrowth]
  );

  const coursePerformanceHasData = useMemo(
    () =>
      dashboard.charts.coursePerformance.some(
        (point) =>
          point.enrollments > 0 || point.completions > 0 || point.reviews > 0
      ),
    [dashboard.charts.coursePerformance]
  );

  const chartTooltipStyle = {
    background: colors.card || "#0F1118",
    border: `1px solid ${colors.ring}`,
    borderRadius: 12,
    color: colors.text,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <h1
            className="text-2xl font-bold md:text-3xl"
            style={{ color: colors.text }}
          >
            Dashboard
          </h1>
          <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
            Real-time overview from users, courses, reviews, enrollments, and chassis symptoms.
          </div>
        </div>

        <div className="text-sm md:text-right" style={{ color: colors.text2 }}>
          <div>{dashboard.rangeLabel}</div>
          <div className="mt-1">
            {dashboard.lastUpdatedAt
              ? `Updated ${dashboard.lastUpdatedLabel}`
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

      {error ? <InlineNotice message={error} colors={colors} /> : null}

      <KpiTiles items={kpiItems} loading={loading} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PanelCard
            title="User growth vs logins"
            subtitle="Signups and login activity"
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
                  <XAxis
                    dataKey="label"
                    tick={{ fill: colors.text2, fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: colors.text2, fontSize: 12 }}
                  />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ color: colors.text2 }} />
                  <Bar
                    dataKey="signups"
                    name="Signups"
                    fill={colors.gold || "#D4AF37"}
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
            <ChartFooterNote
              visible={!loading && !userGrowthHasData}
              message="No signup or login activity was recorded in this period."
              colors={colors}
            />
          </PanelCard>
        </div>

        <div className="space-y-6">
          <RecentUsersCard
            users={dashboard.recentUsers}
            rangeLabel={dashboard.rangeLabel}
            loading={loading}
            colors={colors}
          />
          <QuickActionsCard colors={colors} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <PanelCard
            title="Course performance"
            subtitle="Enrollments, completions, and reviews"
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
                  <XAxis
                    dataKey="label"
                    tick={{ fill: colors.text2, fontSize: 12 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: colors.text2, fontSize: 12 }}
                  />
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
                    fill={colors.ok || "#22C55E"}
                    radius={[6, 6, 0, 0]}
                    maxBarSize={22}
                  />
                  <Line
                    type="monotone"
                    dataKey="reviews"
                    name="Reviews"
                    stroke={colors.purple || "#6E56CF"}
                    strokeWidth={2.5}
                    dot={{ r: 2 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <ChartFooterNote
              visible={!loading && !coursePerformanceHasData}
              message="No course enrollments, completions, or reviews were recorded in this period."
              colors={colors}
            />
          </PanelCard>
        </div>

        <ActivityFeed
          items={dashboard.recentActivity}
          rangeLabel={dashboard.rangeLabel}
          loading={loading}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <CourseGalleryCard
          courses={dashboard.recentCourses}
          rangeLabel={dashboard.rangeLabel}
          loading={loading}
          colors={colors}
        />
        <SystemHealth items={dashboard.health} loading={loading} />
      </div>
    </div>
  );
}
