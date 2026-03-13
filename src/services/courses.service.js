/*
 * Service layer for courses data access, shaping, and error translation.
 * Centralizes API interaction details so UI components remain focused on presentation logic.
 */

import { supabase } from "../lib/supabaseClient";

/* -------------------- helpers -------------------- */

const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024; // 200MB
const MAX_THUMBNAIL_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const normalizeLevel = (value) => {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase();
  if (["beginner", "intermediate", "advanced"].includes(normalized)) {
    return normalized;
  }
  return normalized;
};

const mapCoursePayload = (course = {}) => ({
  title: course.title || course.name || "",
  category: course.category || null,
  description: course.description || null,
  level: normalizeLevel(course.level || course.difficulty_level),
  duration_minutes:
    course.duration_minutes != null
      ? Number(course.duration_minutes)
      : course.total_minutes != null
        ? Number(course.total_minutes)
        : null,
  thumbnail_url: course.thumbnail_url || null,
  is_published:
    typeof course.is_published === "boolean" ? course.is_published : false,
});

async function safeRemoveStorageFile(bucket, path) {
  if (!path) return;
  try {
    await supabase.storage.from(bucket).remove([path]);
  } catch (err) {
    console.warn(`Failed to remove old file from ${bucket}:`, err);
  }
}

/* -------------------- COURSES -------------------- */

export async function listCourses(params = {}) {
  const page = Number(params.page ?? 1);
  const pageSize = Number(params.pageSize ?? 15);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("courses")
    .select(
      "id, title, category, description, level, duration_minutes, thumbnail_url, is_published, created_at",
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (params.query) {
    query = query.ilike("title", `%${params.query}%`);
  }

  if (params.level && params.level !== "all") {
    query = query.eq("level", normalizeLevel(params.level));
  }

  if (params.access && params.access !== "all") {
    if (params.access === "published") query = query.eq("is_published", true);
    if (params.access === "draft") query = query.eq("is_published", false);
  }

  const { data, error, count } = await query;
  if (error) throw error;

  return {
    success: true,
    data: data || [],
    total: typeof count === "number" ? count : (data || []).length,
  };
}

export async function getCourseById(id) {
  const { data, error } = await supabase
    .from("courses")
    .select(
      "id, title, category, description, level, duration_minutes, thumbnail_url, is_published, created_at"
    )
    .eq("id", id)
    .single();

  if (error) throw error;
  return { success: true, data };
}

export async function createCourse(course) {
  const payload = mapCoursePayload(course);

  const { data, error } = await supabase
    .from("courses")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
}

export async function updateCourse(id, course) {
  const payload = mapCoursePayload(course);

  const { data, error } = await supabase
    .from("courses")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
}

export async function deleteCourse(id) {
  const { error } = await supabase.from("courses").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

/* -------------------- LESSONS -------------------- */

export async function listLessonsForCourse(courseId) {
  const { data, error } = await supabase
    .from("course_lessons")
    .select("id, title, order_index, video_path, duration_seconds, created_at")
    .eq("course_id", courseId)
    .order("order_index", { ascending: true });

  if (error) throw error;
  return { success: true, data: data || [] };
}

export async function getLessonVideoUrl(videoPath) {
  if (!videoPath) return null;
  const { data } = supabase.storage.from("course-videos").getPublicUrl(videoPath);
  return data?.publicUrl || null;
}

/* -------------------- VIDEO UPLOAD -------------------- */

export async function uploadCourseVideo(courseId, file) {
  if (!file) return null;

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error("Video too large. Please upload a file under 200 MB.");
  }

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = `${courseId}/${fileName}`;

  const { error } = await supabase.storage.from("course-videos").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("course-videos").getPublicUrl(filePath);

  return { path: filePath, publicUrl: data?.publicUrl || null };
}

export async function createLessonForCourse(
  courseId,
  { title, duration_seconds },
  videoFile
) {
  if (!videoFile) return null;

  const uploadRes = await uploadCourseVideo(courseId, videoFile);

  const { data, error } = await supabase
    .from("course_lessons")
    .insert({
      course_id: courseId,
      title: title || "Lesson 1",
      order_index: 1,
      video_path: uploadRes.path,
      duration_seconds: duration_seconds || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
}

export async function upsertFirstLessonForCourse(
  courseId,
  { title, duration_seconds },
  videoFile
) {
  if (!courseId) {
    throw new Error("Course id is required.");
  }

  let uploadRes = null;
  if (videoFile) {
    uploadRes = await uploadCourseVideo(courseId, videoFile);
  }

  const { data: existingLesson, error: existingError } = await supabase
    .from("course_lessons")
    .select("id, video_path")
    .eq("course_id", courseId)
    .eq("order_index", 1)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;

  const lessonPayload = {
    title: title || "Lesson 1",
    duration_seconds:
      typeof duration_seconds === "number" ? duration_seconds : null,
  };

  if (uploadRes?.path) {
    lessonPayload.video_path = uploadRes.path;
  }

  if (existingLesson?.id) {
    const { data, error } = await supabase
      .from("course_lessons")
      .update(lessonPayload)
      .eq("id", existingLesson.id)
      .select()
      .single();

    if (error) throw error;

    if (
      existingLesson.video_path &&
      uploadRes?.path &&
      existingLesson.video_path !== uploadRes.path
    ) {
      await safeRemoveStorageFile("course-videos", existingLesson.video_path);
    }

    return { success: true, data };
  }

  const { data, error } = await supabase
    .from("course_lessons")
    .insert({
      course_id: courseId,
      order_index: 1,
      title: lessonPayload.title,
      duration_seconds: lessonPayload.duration_seconds,
      video_path: uploadRes?.path || null,
    })
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
}

/* -------------------- THUMBNAIL UPLOAD -------------------- */

export async function uploadCourseThumbnail(file) {
  if (!file) return null;

  if (file.size > MAX_THUMBNAIL_SIZE_BYTES) {
    throw new Error("Thumbnail too large. Please upload an image under 10 MB.");
  }

  const safeName = file.name.replace(/\s+/g, "-").toLowerCase();
  const fileName = `${Date.now()}-${safeName}`;
  const filePath = `thumbnails/${fileName}`;

  const { error } = await supabase.storage.from("course-thumbnails").upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("course-thumbnails").getPublicUrl(filePath);
  return { path: filePath, publicUrl: data?.publicUrl || null };
}