import React, { useState } from "react";
import { useTheme } from "../../contexts/ThemeContext";
import SectionCard from "../../components/ui/common/SectionCard";
import Pagination from "../../components/ui/common/Pagination";
import CourseFiltersBar from "../../components/courses/catalog/CourseFiltersBar";
import CourseTable from "../../components/courses/catalog/CourseTable";
import CourseEditorDrawer from "../../components/courses/catalog/CourseEditorDrawer";
import TopicsTable from "../../components/courses/topics/TopicsTable";
import TopicEditorDrawer from "../../components/courses/topics/TopicEditorDrawer";
import MediaFiltersBar from "../../components/courses/media/MediaFiltersBar";
import MediaTable from "../../components/courses/media/MediaTable";
import MediaEditorDrawer from "../../components/courses/media/MediaEditorDrawer";
import PricingTable from "../../components/courses/pricing/PricingTable";
import PricingEditorDrawer from "../../components/courses/pricing/PricingEditorDrawer";
import ProgressTable from "../../components/courses/progress/ProgressTable";
import { useCourses } from "../../hooks/useCourses";
import { useTopics } from "../../hooks/useTopics";
import { useMedia } from "../../hooks/useMedia";
import { usePricing } from "../../hooks/usePricing";
import { useProgress } from "../../hooks/useProgress";

export default function CoursesManagement() {
  const { colors } = useTheme();

  /* ----------------------------- catalog state ---------------------------- */
  const courses = useCourses();
  const [editingCourse, setEditingCourse] = useState(null);
  const [openCourse, setOpenCourse] = useState(false);

  /* ------------------------------ topics state ---------------------------- */
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const topics = useTopics({ courseId: selectedCourseId });
  const [editingTopic, setEditingTopic] = useState(null);
  const [openTopic, setOpenTopic] = useState(false);

  /* ------------------------------- media state ---------------------------- */
  const media = useMedia({ courseId: selectedCourseId });
  const [editingAsset, setEditingAsset] = useState(null);
  const [openAsset, setOpenAsset] = useState(false);

  /* ----------------------------- pricing state ---------------------------- */
  const pricing = usePricing();
  const [editingPrice, setEditingPrice] = useState(null);
  const [openPrice, setOpenPrice] = useState(false);

  /* ----------------------------- progress state --------------------------- */
  const progress = useProgress();

  return (
    <div className="space-y-6">
      {/* Course Catalog */}
      <SectionCard
        title="Course Catalog"
        subtitle="Create new courses / modules"
        right={
          <div className="flex items-center gap-2">
            <select
              className="rounded-xl border px-3 py-2 text-xs"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text,
              }}
              value={selectedCourseId || ""}
              onChange={(e) => setSelectedCourseId(e.target.value || null)}
            >
              <option value="">Focus: All Courses</option>
              {courses.rows.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
            <button
              className="px-3 py-2 rounded-xl border"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.hover,
                color: colors.text2,
              }}
              onClick={() => {
                setEditingCourse(null);
                setOpenCourse(true);
              }}
            >
              Add Course
            </button>
          </div>
        }
      >
        <div className="mb-4">
          <CourseFiltersBar
            query={courses.state.query}
            onQuery={courses.search}
            level={courses.state.level}
            onLevel={courses.setLevel}
            access={courses.state.access}
            onAccess={courses.setAccess}
          />
        </div>
        <CourseTable
          rows={courses.rows}
          loading={courses.loading}
          onEdit={(c) => {
            setEditingCourse(c);
            setOpenCourse(true);
          }}
        />
        <Pagination
          page={courses.state.page}
          pageSize={courses.state.pageSize}
          total={courses.total}
          onPageChange={courses.setPage}
        />
      </SectionCard>

      {/* Topics Manager */}
      <SectionCard
        title="Topics Manager"
        subtitle="Organize tyres, shocks, camber, alignment, anti-roll bars"
        right={
          <button
            className="px-3 py-2 rounded-xl border"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text2,
            }}
            onClick={() => {
              if (!selectedCourseId)
                return alert("Choose a course in the Focus selector");
              setEditingTopic(null);
              setOpenTopic(true);
            }}
          >
            Add Topic
          </button>
        }
      >
        <TopicsTable
          rows={topics.rows}
          loading={topics.loading}
          onEdit={(t) => {
            setEditingTopic(t);
            setOpenTopic(true);
          }}
        />
      </SectionCard>

      {/* Media Library */}
      <SectionCard
        title="Media Library"
        subtitle="Upload PDFs, videos, diagrams"
        right={
          <button
            className="px-3 py-2 rounded-xl border"
            style={{
              borderColor: colors.ring,
              backgroundColor: colors.hover,
              color: colors.text2,
            }}
            onClick={() => {
              if (!selectedCourseId)
                return alert("Choose a course in the Focus selector");
              setEditingAsset(null);
              setOpenAsset(true);
            }}
          >
            Add Media
          </button>
        }
      >
        <div className="mb-4">
          <MediaFiltersBar
            query={media.query}
            onQuery={media.setQuery}
            type={media.type}
            onType={media.setType}
          />
        </div>
        <MediaTable
          rows={media.rows}
          loading={media.loading}
          onEdit={(m) => {
            setEditingAsset(m);
            setOpenAsset(true);
          }}
        />
      </SectionCard>

      {/* Pricing & Access */}
      <SectionCard
        title="Pricing & Access"
        subtitle="Assign pricing tiers and bundles (basic)"
      >
        <PricingTable
          rows={pricing.rows}
          loading={pricing.loading}
          onEdit={(r) => {
            setEditingPrice(r);
            setOpenPrice(true);
          }}
        />
      </SectionCard>

      {/* Learner Progress */}
      <SectionCard
        title="Learner Progress"
        subtitle="Track learners, avg progress, completions"
      >
        <ProgressTable rows={progress.rows} loading={progress.loading} />
      </SectionCard>

      {/* Drawers */}
      <CourseEditorDrawer
        open={openCourse}
        onClose={() => setOpenCourse(false)}
        course={editingCourse}
        onSave={async (f) => {
          await courses.save({ ...editingCourse, ...f });
          setOpenCourse(false);
        }}
      />

      <TopicEditorDrawer
        open={openTopic}
        onClose={() => setOpenTopic(false)}
        topic={editingTopic}
        onSave={async (f) => {
          if (!selectedCourseId)
            return alert("Choose a course in the Focus selector");
          await topics.save({ ...editingTopic, ...f });
          setOpenTopic(false);
        }}
      />

      <MediaEditorDrawer
        open={openAsset}
        onClose={() => setOpenAsset(false)}
        asset={editingAsset}
        onSave={async (f) => {
          if (!selectedCourseId)
            return alert("Choose a course in the Focus selector");
          await media.save({ ...editingAsset, ...f });
          setOpenAsset(false);
        }}
      />

      <PricingEditorDrawer
        open={openPrice}
        onClose={() => setOpenPrice(false)}
        row={editingPrice}
        onSave={async (f) => {
          await pricing.save(editingPrice.courseId, f);
          setOpenPrice(false);
        }}
      />
    </div>
  );
}
