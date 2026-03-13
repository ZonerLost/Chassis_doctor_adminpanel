/*
 * Page container for courses management workflows in the admin interface.
 * Composes feature hooks and presentational components at the route boundary.
 */

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  MdAdd,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdLibraryBooks,
} from "react-icons/md";
import toast from "react-hot-toast";

import { useTheme } from "../contexts/ThemeContext";
import CourseTable from "../components/courses/catalog/CourseTable";
import CourseEditorModal from "../components/courses/catalog/CourseEditorModal";
import CourseDetailModal from "../components/courses/catalog/CourseDetailModal.jsx";
import ConfirmModal from "../components/ui/shared/ConfirmModal";
import LoadingSpinner from "../components/ui/shared/LoadingSpinner.jsx";

import {
  createCourse,
  deleteCourse,
  getCourseById,
  listCourses,
  updateCourse,
  uploadCourseThumbnail,
  upsertFirstLessonForCourse,
} from "../services/courses.service.js";

const PAGE_SIZE_OPTIONS = [15, 30, 50];

export default function CoursesManagement() {
  const { colors } = useTheme();

  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [courseEditorOpen, setCourseEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const [viewCourse, setViewCourse] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCourses / pageSize)),
    [pageSize, totalCourses]
  );

  const showingFrom = totalCourses === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const showingTo = Math.min(currentPage * pageSize, totalCourses);

  const loadCourses = useCallback(async (page, size) => {
    setLoading(true);
    try {
      const res = await listCourses({
        page,
        pageSize: size,
      });

      setCourses(Array.isArray(res?.data) ? res.data : []);
      setTotalCourses(Number(res?.total || 0));
    } catch (err) {
      console.error("Failed to load courses:", err);
      toast.error(err?.message || "Failed to load courses.");
      setCourses([]);
      setTotalCourses(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses(currentPage, pageSize);
  }, [currentPage, pageSize, loadCourses]);

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
      setDetailError(err?.message || "Failed to load course details");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleSaveCourse = async ({ coursePayload, videoFile, thumbnailFile }) => {
    try {
      let finalPayload = { ...coursePayload };

      if (thumbnailFile) {
        const thumbRes = await uploadCourseThumbnail(thumbnailFile);
        if (thumbRes?.publicUrl) {
          finalPayload.thumbnail_url = thumbRes.publicUrl;
        }
      }

      const saveRes = finalPayload?.id
        ? await updateCourse(finalPayload.id, finalPayload)
        : await createCourse(finalPayload);

      const savedCourse = saveRes?.data || saveRes;

      if (videoFile && savedCourse?.id) {
        await upsertFirstLessonForCourse(
          savedCourse.id,
          {
            title: `${savedCourse.title} - Lesson 1`,
            duration_seconds: savedCourse.duration_minutes
              ? Number(savedCourse.duration_minutes) * 60
              : null,
          },
          videoFile
        );
      }

      setCourseEditorOpen(false);
      setEditingCourse(null);

      const isEditing = !!finalPayload?.id;
      const targetPage = isEditing ? currentPage : 1;

      if (targetPage !== currentPage) {
        setCurrentPage(targetPage);
      }

      await loadCourses(targetPage, pageSize);

      toast.success(
        `Course "${savedCourse?.title || savedCourse?.name || "Untitled"}" saved successfully.`
      );
    } catch (err) {
      console.error("Failed to save course:", err);
      toast.error(err?.message || "Failed to save course.");
    }
  };

  const handleDeleteCourse = (course) => {
    if (!course) return;
    setCourseToDelete(course);
  };

  const confirmDeleteCourse = async () => {
    if (!courseToDelete?.id) return;

    try {
      setDeleting(true);

      const deletingCourse = courseToDelete;

      await deleteCourse(deletingCourse.id);

      if (editingCourse?.id === deletingCourse.id) {
        setCourseEditorOpen(false);
        setEditingCourse(null);
      }

      if (viewCourse?.id === deletingCourse.id) {
        setViewCourse(null);
        setDetailError(null);
      }

      const nextTotal = Math.max(0, totalCourses - 1);
      const nextPage = Math.min(
        currentPage,
        Math.max(1, Math.ceil(nextTotal / pageSize))
      );

      setCourseToDelete(null);

      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      }

      await loadCourses(nextPage, pageSize);
      toast.success(
        `Deleted "${deletingCourse.title || deletingCourse.name || "course"}".`
      );
    } catch (err) {
      console.error("Failed to delete course:", err);
      toast.error(err?.message || "Failed to delete course.");
    } finally {
      setDeleting(false);
    }
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="space-y-5 sm:space-y-6 min-w-0">
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12"
            style={{ backgroundColor: `${colors.accent}20` }}
          >
            <MdLibraryBooks size={24} style={{ color: colors.accent }} />
          </div>

          <div className="min-w-0">
            <h1
              className="text-xl font-semibold sm:text-2xl"
              style={{ color: colors.text }}
            >
              Courses Management
            </h1>
            <div className="mt-1 text-sm" style={{ color: colors.text2 }}>
              Manage course catalog and content
            </div>
          </div>
        </div>

        <button
          onClick={handleAddCourse}
          className="flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold sm:w-auto sm:px-5"
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
        className="overflow-hidden rounded-[24px]"
        style={{
          backgroundColor: colors.bg2,
          border: `1px solid ${colors.ring}`,
        }}
      >
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingSpinner label="Loading courses..." subtle />
          </div>
        ) : (
          <>
            <CourseTable
              courses={courses}
              onEdit={handleEditCourse}
              onView={handleViewCourse}
            />

            <div
              className="flex flex-col gap-4 border-t px-4 py-4 sm:px-5 xl:flex-row xl:items-center xl:justify-between"
              style={{
                borderColor: colors.ring,
                backgroundColor: colors.card || colors.bg2,
              }}
            >
              <div className="text-sm" style={{ color: colors.text2 }}>
                {totalCourses === 0
                  ? "No courses available."
                  : `Showing ${showingFrom}-${showingTo} of ${totalCourses} courses`}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <div className="flex items-center justify-between gap-3 sm:justify-start">
                  <span className="text-sm" style={{ color: colors.text2 }}>
                    Rows
                  </span>

                  <select
                    value={pageSize}
                    onChange={(e) => {
                      const nextSize = Number(e.target.value);
                      setPageSize(nextSize);
                      setCurrentPage(1);
                    }}
                    className="rounded-xl px-4 py-2.5 outline-none"
                    style={{
                      backgroundColor: colors.bg2,
                      color: colors.text,
                      border: `1px solid ${colors.ring}`,
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <option key={size} value={size}>
                        {size} / page
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={() => canGoPrev && setCurrentPage((prev) => prev - 1)}
                    disabled={!canGoPrev}
                    className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium"
                    style={{
                      backgroundColor: colors.bg2,
                      color: canGoPrev ? colors.text : colors.text2,
                      border: `1px solid ${colors.ring}`,
                      opacity: canGoPrev ? 1 : 0.55,
                    }}
                  >
                    <MdKeyboardArrowLeft size={18} />
                    Prev
                  </button>

                  <div
                    className="min-w-[76px] text-center text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    {currentPage} / {totalPages}
                  </div>

                  <button
                    onClick={() => canGoNext && setCurrentPage((prev) => prev + 1)}
                    disabled={!canGoNext}
                    className="inline-flex items-center gap-1 rounded-xl px-4 py-2.5 text-sm font-medium"
                    style={{
                      backgroundColor: colors.bg2,
                      color: canGoNext ? colors.text : colors.text2,
                      border: `1px solid ${colors.ring}`,
                      opacity: canGoNext ? 1 : 0.55,
                    }}
                  >
                    Next
                    <MdKeyboardArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          </>
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
          if (!deleting) setCourseToDelete(null);
        }}
        onConfirm={confirmDeleteCourse}
      />
    </div>
  );
}