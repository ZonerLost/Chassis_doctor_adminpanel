import React from "react";
import { useTheme } from "../../../contexts/ThemeContext";
import {
  MdClose,
  MdStar,
  MdPeople,
  MdSchedule,
  MdCategory,
} from "react-icons/md";

export default function CourseViewModal({ course, open, onClose }) {
  const { colors } = useTheme();

  if (!open || !course) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ backgroundColor: colors.card }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6 border-b"
          style={{ borderColor: colors.ring }}
        >
          <h2 className="text-xl font-semibold" style={{ color: colors.text }}>
            Course Details
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-opacity-20 transition-colors"
            style={{ color: colors.text2 }}
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Title and Basic Info */}
          <div>
            <h1
              className="text-2xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              {course.title}
            </h1>
            <p className="text-sm mb-4" style={{ color: colors.text2 }}>
              {course.description}
            </p>

            <div className="flex flex-wrap gap-4 mb-4">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: getLevelColor(course.level) + "20",
                  color: getLevelColor(course.level),
                }}
              >
                {course.level}
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: colors.accent + "15",
                  color: colors.accent,
                }}
              >
                {course.type}
              </span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor:
                    course.status === "Published" ? "#22C55E20" : "#F59E0B20",
                  color: course.status === "Published" ? "#22C55E" : "#F59E0B",
                }}
              >
                {course.status}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: colors.hover }}
            >
              <div className="flex items-center justify-center mb-2">
                <MdSchedule size={20} style={{ color: colors.accent }} />
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {course.duration}
              </div>
              <div className="text-xs" style={{ color: colors.text2 }}>
                Duration
              </div>
            </div>

            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: colors.hover }}
            >
              <div className="flex items-center justify-center mb-2">
                <MdPeople size={20} style={{ color: colors.accent }} />
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {course.students.toLocaleString()}
              </div>
              <div className="text-xs" style={{ color: colors.text2 }}>
                Students
              </div>
            </div>

            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: colors.hover }}
            >
              <div className="flex items-center justify-center mb-2">
                <MdStar size={20} style={{ color: "#F59E0B" }} />
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                {course.rating}/5
              </div>
              <div className="text-xs" style={{ color: colors.text2 }}>
                Rating
              </div>
            </div>

            <div
              className="p-4 rounded-xl text-center"
              style={{ backgroundColor: colors.hover }}
            >
              <div className="flex items-center justify-center mb-2">
                <span
                  className="text-lg font-bold"
                  style={{ color: colors.accent }}
                >
                  $
                </span>
              </div>
              <div
                className="text-sm font-medium"
                style={{ color: colors.text }}
              >
                ${course.price}
              </div>
              <div className="text-xs" style={{ color: colors.text2 }}>
                Price
              </div>
            </div>
          </div>

          {/* Course Details */}
          <div className="space-y-4">
            <div>
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: colors.text }}
              >
                Course Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: colors.text2 }}
                  >
                    Instructor
                  </label>
                  <div className="text-sm mt-1" style={{ color: colors.text }}>
                    {course.instructor}
                  </div>
                </div>
                <div>
                  <label
                    className="text-sm font-medium"
                    style={{ color: colors.text2 }}
                  >
                    Created Date
                  </label>
                  <div className="text-sm mt-1" style={{ color: colors.text }}>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Categories */}
            {course.categories && course.categories.length > 0 && (
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: colors.text }}
                >
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {course.categories.map((category, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-lg text-xs font-medium"
                      style={{
                        backgroundColor: colors.accent + "10",
                        color: colors.accent,
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-3 p-6 border-t"
          style={{ borderColor: colors.ring }}
        >
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: colors.hover,
              color: colors.text,
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function getLevelColor(level) {
  switch (level.toLowerCase()) {
    case "beginner":
      return "#22C55E";
    case "intermediate":
      return "#F59E0B";
    case "advanced":
      return "#EF4444";
    default:
      return "#6B7280";
  }
}
