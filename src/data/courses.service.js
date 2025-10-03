import { SAMPLE_COURSES } from "./courses.fixtures.js";

let courses = [...SAMPLE_COURSES];

export const listCourses = async (filters = {}) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    let filteredCourses = [...courses];

    // Apply filters
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCourses = filteredCourses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm) ||
          course.instructor.toLowerCase().includes(searchTerm) ||
          course.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.level && filters.level !== "all") {
      filteredCourses = filteredCourses.filter(
        (course) => course.level.toLowerCase() === filters.level.toLowerCase()
      );
    }

    if (filters.type && filters.type !== "all") {
      filteredCourses = filteredCourses.filter(
        (course) => course.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    if (filters.status && filters.status !== "all") {
      filteredCourses = filteredCourses.filter(
        (course) => course.status.toLowerCase() === filters.status.toLowerCase()
      );
    }

    return {
      success: true,
      data: filteredCourses,
      total: filteredCourses.length,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
};

export const createCourse = async (courseData) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate API delay

    const newCourse = {
      id: Date.now(),
      ...courseData,
      students: 0,
      rating: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: courseData.status || "Draft",
    };

    courses.push(newCourse);

    return {
      success: true,
      data: newCourse,
      message: "Course created successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 600)); // Simulate API delay

    const index = courses.findIndex((course) => course.id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }

    courses[index] = { ...courses[index], ...courseData };

    return {
      success: true,
      data: courses[index],
      message: "Course updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

export const deleteCourse = async (id) => {
  try {
    await new Promise((resolve) => setTimeout(resolve, 400)); // Simulate API delay

    const index = courses.findIndex((course) => course.id === id);
    if (index === -1) {
      throw new Error("Course not found");
    }

    courses.splice(index, 1);

    return {
      success: true,
      message: "Course deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};
