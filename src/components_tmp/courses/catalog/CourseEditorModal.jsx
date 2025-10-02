import React from "react";
import CourseEditorDrawer from "./CourseEditorDrawer";

/*
  Compatibility wrapper: map `isOpen` → `open` so pages importing
  CourseEditorModal keep working with the existing drawer component.
*/
export default function CourseEditorModal({
  isOpen,
  onClose,
  course = null,
  onSave,
  ...rest
}) {
  return (
    <CourseEditorDrawer
      open={!!isOpen}
      initial={course}
      course={course}
      onClose={onClose}
      onSave={onSave}
      {...rest}
    />
  );
}
