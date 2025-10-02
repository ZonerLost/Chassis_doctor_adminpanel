import React, { useState } from "react";
import { useTheme } from "../contexts/ThemeContext";
import CourseTable from "../components/courses/catalog/CourseTable";
import CourseEditorDrawer from "../components/courses/catalog/CourseEditorDrawer";

export default function CoursesManagement() {
  const { colors } = useTheme();

  const [rows, setRows] = useState([
    {
      id: 1,
      title: "Intro to Setup",
      level: "beginner",
      instructorName: "Alex Roe",
      isPaid: false,
    },
    {
      id: 2,
      title: "Advanced Chassis Tuning",
      level: "advanced",
      instructorName: "Casey Lee",
      isPaid: true,
      priceCents: 9999,
    },
    {
      id: 3,
      title: "Race Strategy 101",
      level: "intermediate",
      instructorName: "Sam Park",
      isPaid: false,
    },
  ]);

  const [editing, setEditing] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openForAdd = () => {
    setEditing(null);
    setIsOpen(true);
  };

  const openForEdit = (course) => {
    setEditing(course);
    setIsOpen(true);
  };

  // onSave can be async — return Promise so editors that await it work
  const handleSave = async (course) => {
    setRows((prev) => {
      const exists = prev.some((r) => r.id === course.id);
      if (exists) {
        return prev.map((r) => (r.id === course.id ? { ...r, ...course } : r));
      }
      return [{ ...course, id: course.id || Date.now() }, ...prev];
    });
    // close modal after save
    setIsOpen(false);
    return Promise.resolve();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: colors.text }} className="text-2xl font-semibold">
            Courses
          </h1>
          <div style={{ color: colors.text2 }} className="text-sm">
            Media library & course management
          </div>
        </div>

        <button
          onClick={openForAdd}
          className="px-4 py-2 rounded-md"
          style={{ background: colors.gold || "#D4AF37", color: "#0B0B0F" }}
        >
          Add Course
        </button>
      </div>

      <CourseTable rows={rows} loading={false} onEdit={openForEdit} />

      <CourseEditorDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        course={editing}
        onSave={handleSave}
      />
    </div>
  );
}
