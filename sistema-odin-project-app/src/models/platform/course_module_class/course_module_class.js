import supabase from "@/utils/supabase/supabaseClient";

export async function getCourseModuleClasses() {
  try {
    const { data, error } = await supabase
      .from("course_module_classes")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModuleClass(course_module_id) {
  try {
    const { data: courseModuleClasses, error } = await supabase
      .from("course_module_classes")
      .select("*")
      .eq("course_module_id", course_module_id);

    if (error) {
      throw error;
    }

    return courseModuleClasses;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModuleClassSingle(course_module_class_id) {
  try {
    const { data: courseModuleClassesSingle, error } = await supabase
      .from("course_module_classes")
      .select("*")
      .eq("id", course_module_class_id)
      .single();
    if (error) {
      throw error;
    }

    return courseModuleClassesSingle;
  } catch (error) {
    throw error;
  }
}

export async function addCourseModuleClass(
  title,
  course_module_id,
  course_format_id,
  description,
  has_video,
  video_link,
  course_platform_tool_id,
  has_link_to_drive,
  drive_link,
  time_to_complete
) {
  try {
    const { data, error } = await supabase
      .from("course_module_classes")
      .insert({
        title: title,
        course_module_id: course_module_id,
        course_format_id: parseInt(course_format_id),
        description: description,
        has_video: has_video,
        video_link: video_link,
        course_platform_tool_id: parseInt(course_platform_tool_id),
        has_link_to_drive: has_link_to_drive,
        drive_link: drive_link,
        time_to_complete: time_to_complete,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCourseModuleClass(
  course_module_class_id,
  title,
  course_module_id,
  course_format_id,
  description,
  has_video,
  video_link,
  course_platform_tool_id,
  has_link_to_drive,
  drive_link,
  time_to_complete
) {
  try {
    const { data, error } = await supabase
      .from("course_module_classes")
      .update({
        title: title,
        course_module_id: course_module_id,
        course_format_id: parseInt(course_format_id),
        description: description,
        has_video: has_video,
        video_link: video_link,
        course_platform_tool_id: parseInt(course_platform_tool_id),
        has_link_to_drive: has_link_to_drive,
        drive_link: drive_link,
        time_to_complete: time_to_complete,
      })
      .eq("id", course_module_class_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseModuleClass(course_module_class_id) {
  try {
    const { data, error } = await supabase
      .from("course_module_classes")
      .delete()
      .eq("id", course_module_class_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModuleClassFormat(courseModuleClassFormatId) {
  try {
    const { data, error } = await supabase
      .from("course_formats")
      .select("name")
      .eq("id", courseModuleClassFormatId)
      .single();
    if (error) {
      throw error;
    }
    return data ? data.name : null;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModuleClassPlatformToolId(
  courseModuleClassPlatformToolId
) {
  try {
    const { data, error } = await supabase
      .from("course_platform_tools")
      .select("name")
      .eq("id", courseModuleClassPlatformToolId)
      .single();
    if (error) {
      throw error;
    }
    return data ? data.name : null;
  } catch (error) {
    throw error;
  }
}
