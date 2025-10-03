import React, { useEffect, useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import { useCourses } from "../hooks/useCourses";
import CourseTable from "../components/courses/catalog/CourseTable";
import CourseEditorModal from "../components/courses/catalog/CourseEditorModal";
import { MdAdd, MdLibraryBooks } from "react-icons/md";

export default function CoursesManagement() {
  const { colors } = useTheme();
  const [filters] = useState({});
  const { rows: rowsFromHook, loading, save, refresh } = useCourses(filters);

  // local copy so UI updates immediately after save/delete
  const [localCourses, setLocalCourses] = useState([]);

  // editor modal state
  const [courseEditorOpen, setCourseEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  // sync hook rows -> local
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

  const handleSaveCourse = async (courseData) => {
    try {
      // call hook save()
      const result = await save(courseData);
      const saved = result?.data ?? result?.item ?? result ?? courseData;

      setLocalCourses((prev) => {
        const exists = prev.some((r) => String(r.id) === String(saved.id));
        if (exists) {
          return prev.map((r) =>
            String(r.id) === String(saved.id) ? saved : r
          );
        }
        return [saved, ...prev];
      });

      // background refresh if available
      refresh && refresh();

      setCourseEditorOpen(false);
      setEditingCourse(null);
      console.log("Course saved and UI updated:", saved);
    } catch (err) {
      console.error("Failed to save course:", err);
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!course) return;
    if (!window.confirm(`Delete "${course.title || course.name}"?`)) return;

    try {
      // optimistically remove from UI
      setLocalCourses((prev) =>
        prev.filter((r) => String(r.id) !== String(course.id))
      );
      // ask hook to refresh (if hook implements server delete)
      refresh && refresh();
      if (editingCourse?.id === course.id) {
        setCourseEditorOpen(false);
        setEditingCourse(null);
      }
    } catch (err) {
      console.error("Failed to delete course:", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: colors.accent + "20" }}
          >
            <MdLibraryBooks size={24} style={{ color: colors.accent }} />
          </div>
          <div>
            <h1
              className="text-2xl font-semibold"
              style={{ color: colors.text }}
            >
              Courses Management
            </h1>
            <div className="text-sm mt-1" style={{ color: colors.text2 }}>
              Manage course catalog and content
            </div>
          </div>
        </div>

        <button
          onClick={handleAddCourse}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:opacity-80"
          style={{
            backgroundColor: colors.accent,
            color: "#000",
          }}
        >
          <MdAdd size={18} />
          New Course
        </button>
      </div>

      <div style={{ backgroundColor: colors.bg2 }}>
        <CourseTable
          courses={localCourses}
          loading={loading}
          onEdit={handleEditCourse}
        />
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
    </div>
  );
}
