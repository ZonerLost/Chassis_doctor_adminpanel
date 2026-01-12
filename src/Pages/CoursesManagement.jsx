import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useCourses } from "../hooks/useCourses";
import CourseTable from "../components/courses/catalog/CourseTable";
import CourseEditorModal from "../components/courses/catalog/CourseEditorModal";
import { MdAdd, MdLibraryBooks } from "react-icons/md";
import { createLessonForCourse, uploadCourseThumbnail, getCourseById } from "../services/courses.service.js";
import ConfirmModal from "../components/ui/shared/ConfirmModal";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner.jsx";
import CourseDetailModal from "../components/courses/catalog/CourseDetailModal.jsx";
import toast from "react-hot-toast";

export default function CoursesManagement() {
  const { colors } = useTheme();
  const [filters] = useState({});
  const { rows: rowsFromHook, loading, save, refresh } = useCourses(filters);

  const [localCourses, setLocalCourses] = useState([]);

  const [courseEditorOpen, setCourseEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [viewCourse, setViewCourse] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setLocalCourses(Array.isArray(rowsFromHook) ? rowsFromHook : []);
  }, [rowsFromHook]);

  const handleAddCourse = () => {
    setEditingCourse(null);
    setCourseEditorOpen(true);
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setCourseEditorOpen(true);
  };

  const handleViewCourse = async (course) => {
    if (!course?.id) return;
    setDetailError(null);
    setViewCourse(course);
    setDetailLoading(true);
    try {
      const res = await getCourseById(course.id);
      setViewCourse(res?.data || course);
    } catch (err) {
      console.error("Failed to load course details:", err);
      setDetailError(err.message || "Failed to load course details");
    } finally {
      setDetailLoading(false);
    }
  };

  // courseDataBundle = { coursePayload, videoFile, thumbnailFile }
  const handleSaveCourse = async (courseDataBundle) => {
    try {
      const { coursePayload, videoFile, thumbnailFile } = courseDataBundle || {};
      if (!coursePayload) return;

      let finalPayload = { ...coursePayload };

      // 1) upload thumbnail if provided
      if (thumbnailFile) {
        try {
          const thumbRes = await uploadCourseThumbnail(thumbnailFile);
          if (thumbRes?.publicUrl) {
            finalPayload.thumbnail_url = thumbRes.publicUrl;
          }
        } catch (thumbErr) {
          console.error("Thumbnail upload failed:", thumbErr);
          toast.error("Thumbnail upload failed. Course saved without new thumbnail.");
        }
      }

      // 2) save/update course in Supabase
      const savedCourse = await save(finalPayload);

      // 3) if a video was selected, create/update first lesson
        if (videoFile && savedCourse?.id) {
          try {
            await createLessonForCourse(
              savedCourse.id,
              {
                title: `${savedCourse.title} - Lesson 1`,
                duration_seconds: savedCourse.duration_minutes
                  ? savedCourse.duration_minutes * 60
                  : null,
              },
              videoFile
            );
        } catch (videoErr) {
          console.error("Video upload or lesson creation failed:", videoErr);
          toast.error("Lesson video upload failed. Course saved without video.");
        }
      }

      setLocalCourses((prev) => {
        const exists = prev.some((r) => String(r.id) === String(savedCourse.id));
        if (exists) {
          return prev.map((r) =>
            String(r.id) === String(savedCourse.id) ? savedCourse : r
          );
        }
        return [savedCourse, ...prev];
      });

      refresh && refresh();

      setCourseEditorOpen(false);
      setEditingCourse(null);
      toast.success(`Course "${savedCourse.title || savedCourse.name}" saved.`);
    } catch (err) {
      console.error("Failed to save course:", err);
      const message = err?.message || "Failed to save course.";
      toast.error(message);
    }
  };

  const handleDeleteCourse = (course) => {
    if (!course) return;
    setCourseToDelete(course);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete) return;
    const course = courseToDelete;
    try {
      setDeleting(true);

      // optimistic UI removal; actual delete handled in separate flow if you wire it
      setLocalCourses((prev) =>
        prev.filter((r) => String(r.id) !== String(course.id))
      );

      refresh && refresh();
      toast.success(`Deleted "${course.title || course.name}".`);

      if (editingCourse?.id === course.id) {
        setCourseEditorOpen(false);
        setEditingCourse(null);
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
      const message = err?.message || "Failed to delete course.";
      toast.error(message);
    } finally {
      setDeleting(false);
      setCourseToDelete(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <div
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.accent + "20" }}
          >
            <MdLibraryBooks
              size={22}
              className="sm:hidden"
              style={{ color: colors.accent }}
            />
            <MdLibraryBooks
              size={24}
              className="hidden sm:block"
              style={{ color: colors.accent }}
            />
          </div>
          <div>
            <h1
              className="text-xl sm:text-2xl font-semibold"
              style={{ color: colors.text }}
            >
              Courses Management
            </h1>
            <div
              className="text-xs sm:text-sm mt-1"
              style={{ color: colors.text2 }}
            >
              Manage course catalog and content
            </div>
          </div>
        </div>

        <button
          onClick={handleAddCourse}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: colors.accent,
            color: "#000",
          }}
        >
          <MdAdd size={18} />
          New Course
        </button>
      </div>

      <div
        className="-mx-2 sm:mx-0 overflow-x-auto rounded-xl"
        style={{ backgroundColor: colors.bg2 }}
      >
        {loading ? (
          <div className="min-w-[680px] sm:min-w-0 flex justify-center py-12 sm:py-16">
            <LoadingSpinner label="Loading courses..." subtle />
          </div>
        ) : (
          <div className="min-w-[680px] sm:min-w-0">
          <CourseTable
            courses={localCourses}
            loading={loading}
            onEdit={handleEditCourse}
            onView={handleViewCourse}
          />
        </div>
      )}
      </div>

      <CourseEditorModal
        isOpen={courseEditorOpen}
        course={editingCourse}
        onClose={() => {
          setCourseEditorOpen(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCourse}
        onDelete={handleDeleteCourse}
      />

      <CourseDetailModal
        isOpen={!!viewCourse}
        course={viewCourse}
        onClose={() => {
          setViewCourse(null);
          setDetailError(null);
        }}
        loadingDetails={detailLoading}
        detailError={detailError}
      />

      <ConfirmModal
        open={!!courseToDelete}
        title="Delete course?"
        message={
          courseToDelete
            ? `This will permanently remove "${courseToDelete.title || courseToDelete.name}".`
            : ""
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmTone="danger"
        loading={deleting}
        onCancel={() => {
          if (deleting) return;
          setCourseToDelete(null);
        }}
        onConfirm={confirmDeleteCourse}
      />
    </div>
  );
}
