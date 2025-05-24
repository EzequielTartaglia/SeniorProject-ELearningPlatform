import supabase from "@/utils/supabase/supabaseClient";

export async function getCoursePlatformTools() {
  try {
    const { data, error } = await supabase
      .from("course_platform_tools")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addCoursePlatformTool(name, link) {
  try {
    const { data, error } = await supabase
      .from("course_platform_tools")
      .insert({ name: name, link: link });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCoursePlatformTool(coursePlatformToolId) {
  try {
    const { data, error } = await supabase
      .from("course_platform_tools")
      .select("*")
      .eq("id", coursePlatformToolId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCoursePlatformTool(coursePlatformToolId, name, link) {
  try {
    const { data, error } = await supabase
      .from("course_platform_tools")
      .update({ name: name, link: link })
      .eq("id", coursePlatformToolId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCoursePlatformTool(coursePlatformToolId) {
  try {
    const { data, error } = await supabase
      .from("course_platform_tools")
      .delete()
      .eq("id", coursePlatformToolId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModuleClassPlatformTool(
  courseModulePlatformToolId
) {
  try {
    const { data, error } = await supabase
      .from("course_platform_tools")
      .select("name")
      .eq("id", courseModulePlatformToolId)
      .single();
    if (error) {
      throw error;
    }
    return data ? data.name : null;
  } catch (error) {
    throw error;
  }
}
