import supabase from "@/utils/supabase/supabaseClient";

export async function getCourseLevels() {
  try {
    const { data, error } = await supabase.from("course_levels").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseLevel(course_level_id) {
  try {
    const { data: courseModules, error } = await supabase
      .from("course_levels")
      .select("*")
      .eq("id", course_level_id);

    if (error) {
      throw error;
    }

    return courseModules;
  } catch (error) {
    throw error;
  }
}

export async function addCourseLevel(name) {
  try {
    const { data, error } = await supabase
      .from("course_levels")
      .insert({ name: name });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCourseLevel(course_level_id, name) {
  try {
    const { data, error } = await supabase
      .from("course_levels")
      .update({ name: name })
      .eq("id", course_level_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseLevel(course_level_id) {
  try {
    const { data, error } = await supabase
      .from("course_levels")
      .delete()
      .eq("id", course_level_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
