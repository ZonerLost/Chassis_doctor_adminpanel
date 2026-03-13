/*
 * Page container for analytics reporting workflows in the admin interface.
 * Composes feature hooks and presentational components at the route boundary.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/ui/common/SectionCard";
import DateRangeBar from "../components/ui/common/DateRangeBar";
import { useTheme } from "../contexts/ThemeContext";
import { useEngagement } from "../hooks/useEngagement";
import { useCourseAnalytics } from "../hooks/useCourseAnalytics";
import { useChassisAnalytics } from "../hooks/useChassisAnalytics";
import { useExports } from "../hooks/useExports";
import EngagementKPIs from "../components/analytics/engagement/EngagementKPIs";
import EngagementSparkline from "../components/analytics/engagement/EngagementSparkline";
import CourseAnalyticsTable from "../components/analytics/course/CourseAnalyticsTable";
import ChassisAnalyticsTable from "../components/analytics/chassis/ChassisAnalyticsTable";
import ExportCenter from "../components/analytics/export/ExportCenter";

export default function AnalyticsReporting() {
  const navigate = useNavigate();
  const { colors } = useTheme();

  const engagement = useEngagement();
  const course = useCourseAnalytics();
  const chassis = useChassisAnalytics();
  const exportsUx = useExports();

  const handleOpenCourse = (courseRow) => {
    // Change this route if your main course page path is different
    navigate(`/courses/${courseRow.courseId}`);
  };

  const handleExport = ({ format, scope }) => {
    exportsUx.generateReport({
      format,
      scope,
      payload: {
        engagementKpis: engagement.kpis.map((item) => ({
          label: item.label,
          value: item.value,
          help: item.help,
        })),
        engagementRows: engagement.exportRows,
        courseRows: course.exportRows,
        chassisSymptoms: chassis.exportRows.symptoms,
        chassisFixes: chassis.exportRows.fixes,
      },
    });
  };

  return (
    <div className="space-y-6">
      <SectionCard
        title="Engagement Analytics"
        subtitle="Active users and engagement trends for the selected date range"
      >
        <div className="mb-4">
          <DateRangeBar
            from={engagement.from}
            to={engagement.to}
            onFrom={engagement.setFrom}
            onTo={engagement.setTo}
          />
        </div>

        <EngagementKPIs items={engagement.kpis} />

        <div
          className="mt-4 rounded-2xl border p-4"
          style={{
            borderColor: colors.ring,
            backgroundColor: colors.hover,
          }}
        >
          <EngagementSparkline rows={engagement.rows} />
        </div>
      </SectionCard>

      <SectionCard
        title="Course Analytics"
        subtitle="Courses, reviews, enrollments, completions, and completion rate"
      >
        <CourseAnalyticsTable
          rows={course.rows}
          loading={course.loading}
          onOpenCourse={handleOpenCourse}
        />
      </SectionCard>

      <SectionCard
        title="Chassis Analytics"
        subtitle="Most reported symptoms and top fixes with filters and pagination"
      >
        <ChassisAnalyticsTable
          symptoms={chassis.symptoms}
          fixes={chassis.fixes}
          summary={chassis.summary}
          loading={chassis.loading}
        />
      </SectionCard>

      <SectionCard
        title="Export Center"
        subtitle="Export analytics reports for admin review"
      >
        <ExportCenter
          history={exportsUx.history}
          loading={exportsUx.loading}
          onExport={handleExport}
        />
      </SectionCard>
    </div>
  );
}