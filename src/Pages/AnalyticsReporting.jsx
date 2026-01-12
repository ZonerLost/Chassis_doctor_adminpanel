import React from "react";
import SectionCard from "../components/ui/common/SectionCard";
import DateRangeBar from "../components/ui/common/DateRangeBar";
// fixed: import hooks from src/hooks (go up to src then into hooks)
import { useEngagement } from "../hooks/useEngagement";
import { useCourseAnalytics } from "../hooks/useCourseAnalytics";
import { useChassisAnalytics } from "../hooks/useChassisAnalytics";
import { useExports } from "../hooks/useExports";
// removed shared/theme; use theme context instead
import { useTheme } from "../contexts/ThemeContext";
import EngagementKPIs from "../components/analytics/engagement/EngagementKPIs";
import EngagementSparkline from "../components/analytics/engagement/EngagementSparkline";
import CourseAnalyticsTable from "../components/analytics/course/CourseAnalyticsTable";
import ChassisAnalyticsTable from "../components/analytics/chassis/ChassisAnalyticsTable";
import ExportCenter from "../components/analytics/export/ExportCenter";

export default function AnalyticsReporting() {
  const engagement = useEngagement();
  const course = useCourseAnalytics();
  const chassis = useChassisAnalytics();
  const exportsUx = useExports();
  const { colors } = useTheme();

  return (
    <div className="space-y-6">
      {/* Engagement Analytics */}
      <SectionCard
        title="Engagement Analytics"
        subtitle="Active users, retention, module usage"
        right={null}
      >
        <div className="mb-4">
          <DateRangeBar
            from={engagement.from}
            to={engagement.to}
            onFrom={engagement.setFrom}
            onTo={engagement.setTo}
          />
        </div>
        <EngagementKPIs kpis={engagement.kpis} />
        <div
          className="mt-4 p-3 rounded-2xl border"
          style={{ borderColor: colors.ring, backgroundColor: colors.hover }}
        >
          <div className="text-xs mb-2" style={{ color: colors.text2 }}>
            Daily Active Users
          </div>
          <EngagementSparkline rows={engagement.rows} />
        </div>
      </SectionCard>

      {/* Course Analytics */}
      <SectionCard
        title="Course Analytics"
        subtitle="Enrollments, completions, revenue"
        right={
          <select
            className="rounded-xl border px-3 py-2 text-xs"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text,
            }}
            value={course.courseId}
            onChange={(e) => course.setCourseId(e.target.value)}
          >
            <option value="">All courses</option>
            {course.courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        }
      >
        <CourseAnalyticsTable rows={course.rows} loading={course.loading} />
      </SectionCard>

      {/* Chassis Analytics */}
      <SectionCard
        title="Chassis Analytics"
        subtitle="Most reported symptoms & fixes applied"
      >
        <ChassisAnalyticsTable
          symptoms={chassis.symptoms}
          fixes={chassis.fixes}
          loading={chassis.loading}
        />
      </SectionCard>

      {/* Export Center */}
      <SectionCard
        title="Export Center"
        subtitle="CSV/PDF reporting (CSV only in demo)"
      >
        <ExportCenter
          schedules={exportsUx.schedules}
          onExport={(type) => exportsUx.generateCSV(type)}
          onSchedule={(p) => exportsUx.schedule(p)}
        />
      </SectionCard>
    </div>
  );
}
