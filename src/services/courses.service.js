import { supabase } from "../lib/supabaseClient";

/* -------------------- COURSES (Supabase) -------------------- */

export async function listCourses(params = {}) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 20;
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
    query = query.eq("level", params.level);
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

export async function createCourse(course) {
  const payload = {
    title: course.title || course.name,
    category: course.category || null,
    description: course.description || null,
    level: course.level || course.difficulty_level || null,
    duration_minutes:
      course.duration_minutes != null
        ? Number(course.duration_minutes)
        : course.total_minutes != null
          ? Number(course.total_minutes)
          : null,
    thumbnail_url: course.thumbnail_url || null,
    is_published:
      typeof course.is_published === "boolean" ? course.is_published : false,
  };

  const { data, error } = await supabase
    .from("courses")
    .insert(payload)
    .select()
    .single();

  if (error) throw error;
  return { success: true, data };
}

export async function updateCourse(id, course) {
  const payload = {
    title: course.title || course.name,
    category: course.category || null,
    description: course.description || null,
    level: course.level || course.difficulty_level || null,
    duration_minutes:
      course.duration_minutes != null
        ? Number(course.duration_minutes)
        : course.total_minutes != null
          ? Number(course.total_minutes)
          : null,
    thumbnail_url: course.thumbnail_url || null,
    is_published:
      typeof course.is_published === "boolean" ? course.is_published : false,
  };

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

/* -------------------- VIDEO UPLOAD + LESSON -------------------- */

// simple size-limit; real compression should be done on backend/worker
const MAX_VIDEO_SIZE_BYTES = 200 * 1024 * 1024; // 200 MB

export async function uploadCourseVideo(courseId, file) {
  if (!file) return null;

  if (file.size > MAX_VIDEO_SIZE_BYTES) {
    throw new Error(
      "Video too large. Please upload a file under 200 MB (for heavier compression, handle it on the backend)."
    );
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

  return { path: filePath, publicUrl: data.publicUrl };
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
/* -------------------- THUMBNAIL UPLOAD -------------------- */

// Thumbnail upload (PNG/JPG) for courses
export async function uploadCourseThumbnail(file) {
  if (!file) return null;

  const maxSizeBytes = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSizeBytes) {
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

  // data.publicUrl is what you store in courses.thumbnail_url
  return { path: filePath, publicUrl: data.publicUrl };
}
