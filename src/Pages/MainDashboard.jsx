import React, { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import KpiTiles from "../components/dashboard/KpiTiles";
import TrendsMini from "../components/dashboard/TrendsMini";
import ActivityFeed from "../components/dashboard/ActivityFeed";
import QuickActions from "../components/dashboard/QuickActions";
import SystemHealth from "../components/dashboard/SystemHealth";

export default function MainDashboard() {
  const COLORS = {
    bg: "#0B0B0F",
    bg2: "#12131A",
    card: "#161821",
    text: "#E6E8F0",
    text2: "#A3A7B7",
    gold: "#D4AF37",
    purple: "#6E56CF",
    ring: "rgba(110,86,207,0.25)",
  };

  // mock KPIs & trends (keep real data hookup later)
  const kpis = useMemo(
    () => [
      { key: "mau", label: "MAU", value: 239000, change: 6.08 },
      { key: "new_signups", label: "New Signups", value: 1156, change: 15.03 },
      {
        key: "conversion",
        label: "Conversion",
        value: 7.2,
        change: 0.42,
        isPercent: true,
      },
    ],
    []
  );

  const revenueSeries = useMemo(
    () => [
      { month: "Jan", revenue: 12.4, target: 11 },
      { month: "Feb", revenue: 13.1, target: 12 },
      { month: "Mar", revenue: 14.8, target: 13 },
      { month: "Apr", revenue: 15.3, target: 14 },
      { month: "May", revenue: 16.7, target: 15 },
      { month: "Jun", revenue: 18.9, target: 17 },
      { month: "Jul", revenue: 21.2, target: 19 },
    ],
    []
  );

  const engagementSeries = useMemo(
    () => [
      { t: "Jan", minutes: 28 },
      { t: "Feb", minutes: 31 },
      { t: "Mar", minutes: 34 },
      { t: "Apr", minutes: 36 },
      { t: "May", minutes: 39 },
      { t: "Jun", minutes: 43 },
      { t: "Jul", minutes: 47 },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <h1
          className="text-2xl md:text-3xl font-bold"
          style={{ color: COLORS.text }}
        >
          Dashboard
        </h1>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-sm" style={{ color: COLORS.text2 }}>
            Overview & performance
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <KpiTiles kpis={kpis} />

      {/* Big charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue (large) */}
        <div
          className="lg:col-span-2 rounded-2xl p-4"
          style={{
            backgroundColor: COLORS.card,
            border: `1px solid ${COLORS.ring}`,
            color: COLORS.text,
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm" style={{ color: COLORS.text2 }}>
                Revenue (×$1k)
              </div>
              <div
                className="text-lg font-semibold"
                style={{ color: COLORS.text }}
              >
                Monthly revenue vs target
              </div>
            </div>
            <div className="text-sm" style={{ color: COLORS.text2 }}>
              Last 7 months
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChartWrapper data={revenueSeries} colors={COLORS} />
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right column: engagement + quick actions */}
        <div className="space-y-4">
          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.ring}`,
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-sm" style={{ color: COLORS.text2 }}>
                  Engagement
                </div>
                <div
                  className="text-lg font-semibold"
                  style={{ color: COLORS.text }}
                >
                  Avg minutes/session
                </div>
              </div>
              <div className="text-xs" style={{ color: COLORS.text2 }}>
                Trend
              </div>
            </div>
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementSeries}>
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.03)"
                    vertical={false}
                  />
                  <XAxis dataKey="t" tick={{ fill: COLORS.text2 }} />
                  <YAxis tick={{ fill: COLORS.text2 }} />
                  <Tooltip
                    contentStyle={{
                      background: "#0F1118",
                      border: `1px solid ${COLORS.ring}`,
                      color: COLORS.text,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="minutes"
                    stroke={COLORS.gold}
                    strokeWidth={3}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            className="rounded-2xl p-4"
            style={{
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.ring}`,
            }}
          >
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Trends + Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <TrendsMini
            data={{
              subs: revenueSeries.map((r) => ({
                m: r.month,
                cur: r.revenue,
                prev: r.target,
              })),
              revenue: revenueSeries.map((r) => ({
                m: r.month,
                cur: r.revenue,
                prev: r.target,
              })),
              engagement: engagementSeries.map((e) => ({
                m: e.t,
                cur: e.minutes,
                prev: Math.max(0, e.minutes - 3),
              })),
            }}
          />
        </div>

        <div className="space-y-4">
          <ActivityFeed
            items={[
              {
                id: 1,
                title: "Published new coaching video",
                by: "Russell Davis",
                when: "2h ago",
              },
              {
                id: 2,
                title: "Chassis diagnostic updated",
                by: "System",
                when: "4h ago",
              },
              {
                id: 3,
                title: "New VIP signup",
                by: "Marketing",
                when: "Yesterday",
              },
            ]}
          />
          <SystemHealth
            health={{
              ptm: {
                status: "Operational",
                lastSync: "Today 09:15",
                incidents: 0,
              },
              payments: {
                status: "Operational",
                lastSync: "Today 09:10",
                incidents: 0,
              },
              webhooks: {
                status: "Degraded",
                lastSync: "Today 08:51",
                incidents: 1,
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- small helper: composed chart using existing recharts pieces ---------- */
function ComposedChartWrapper({ data = [], colors }) {
  // use BarChart + Line overlay
  return (
    <BarChart data={data} margin={{ top: 8, right: 18, left: 0, bottom: 0 }}>
      <CartesianGrid stroke="rgba(255,255,255,0.03)" vertical={false} />
      <XAxis dataKey="month" tick={{ fill: colors.text2 }} />
      <YAxis tick={{ fill: colors.text2 }} />
      <Tooltip
        contentStyle={{
          background: "#0F1118",
          border: `1px solid ${colors.ring}`,
          color: colors.text,
        }}
      />
      <Legend wrapperStyle={{ color: colors.text2 }} />
      <Bar dataKey="revenue" fill={colors.gold} radius={[6, 6, 0, 0]} />
      <Line
        type="monotone"
        dataKey="target"
        stroke={colors.purple}
        strokeWidth={2}
        dot={false}
      />
    </BarChart>
  );
}
