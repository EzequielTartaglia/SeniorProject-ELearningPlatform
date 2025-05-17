import supabase from "@/utils/supabase/supabaseClient";

export async function getCoursesModules() {
  try {
    const { data, error } = await supabase.from("course_modules").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModules(course_id) {
  try {
    const { data: courseModules, error } = await supabase
      .from("course_modules")
      .select("*")
      .eq("course_id", course_id);

    if (error) {
      throw error;
    }

    return courseModules;
  } catch (error) {
    throw error;
  }
}

export async function addCourseModule(title, description, course_id) {
  try {
    const { data, error } = await supabase.from("course_modules").insert({
      title: title,
      description: description,
      course_id: course_id,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModule(courseModuleId) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .select("*")
      .eq("id", courseModuleId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCourseModule(courseModuleId, title, description) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .update({ title: title, description: description })
      .eq("id", courseModuleId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseModule(courseModuleId) {
  try {
    const { data, error } = await supabase
      .from("course_modules")
      .delete()
      .eq("id", courseModuleId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
