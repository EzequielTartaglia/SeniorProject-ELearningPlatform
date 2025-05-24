import supabase from "@/utils/supabase/supabaseClient";

export async function getCourseFormats() {
  try {
    const { data, error } = await supabase.from("course_formats").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addCourseFormat(name) {
  try {
    const { data, error } = await supabase
      .from("course_formats")
      .insert({ name: name });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseFormat(courseFormatId) {
  try {
    const { data, error } = await supabase
      .from("course_formats")
      .select("*")
      .eq("id", courseFormatId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCourseFormat(courseFormatId, name) {
  try {
    const { data, error } = await supabase
      .from("course_formats")
      .update({ name: name })
      .eq("id", courseFormatId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseFormat(courseFormatId) {
  try {
    const { data, error } = await supabase
      .from("course_formats")
      .delete()
      .eq("id", courseFormatId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
