import supabase from "@/utils/supabase/supabaseClient";
import { getCourseModules } from "../course_module/courses_module";
import { getCourseModuleClass } from "../course_module_class/course_module_class";

export async function getStudentCourseModuleClassProgresses() {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addStudentCourseModuleClassProgress(
  student_course_enrollment_id,
  course_module_class_id,
  platform_user_id,
  is_completed
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .insert({
        student_course_enrollment_id: student_course_enrollment_id,
        course_module_class_id: course_module_class_id,
        platform_user_id: platform_user_id,
        is_completed: is_completed,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addCompleteStudentCourseModuleClassProgress(
  student_course_enrollment_id,
  course_module_class_id,
  platform_user_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .insert({
        student_course_enrollment_id: student_course_enrollment_id,
        course_module_class_id: course_module_class_id,
        platform_user_id: platform_user_id,
        is_completed: true,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getStudentCourseModuleClassProgress(
  student_course_module_class_progress_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .select("*")
      .eq("id", student_course_module_class_progress_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "Error fetching student course module class progress:",
      error
    );
    throw error;
  }
}

export async function editStudentCourseModuleClassProgress(
  student_course_module_class_progress_id,
  student_course_enrollment_id,
  course_module_class_id,
  platform_user_id,
  is_completed
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .update({
        student_course_enrollment_id: student_course_enrollment_id,
        course_module_class_id: course_module_class_id,
        platform_user_id: platform_user_id,
        is_completed: is_completed,
      })
      .eq("id", student_course_module_class_progress_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteStudentCourseModuleClassProgress(
  student_course_module_class_progress_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .delete()
      .eq("id", student_course_module_class_progress_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function completeStudentCourseModuleClassProgress(
  student_course_module_class_progress_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .update({
        is_completed: true,
      })
      .eq("id", student_course_module_class_progress_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function incompleteStudentCourseModuleClassProgress(
  student_course_module_class_progress_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .update({
        is_completed: false,
      })
      .eq("id", student_course_module_class_progress_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function checkIfProgressExists(
  platform_user_id,
  enrollment_id,
  course_module_class_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .select("id")
      .eq("platform_user_id", platform_user_id)
      .eq("student_course_enrollment_id", enrollment_id)
      .eq("course_module_class_id", course_module_class_id)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return !!data;
  } catch (error) {
    console.error("Error checking progress existence:", error.message);
    throw error;
  }
}

export async function getExistingProgressFromUserEnrollmentAndClass(
  platform_user_id,
  enrollment_id,
  course_module_class_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .select("id")
      .eq("platform_user_id", platform_user_id)
      .eq("student_course_enrollment_id", enrollment_id)
      .eq("course_module_class_id", course_module_class_id)
      .limit(1)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error checking progress existence:", error.message);
    throw error;
  }
}

export async function getStudentProgressIds(platform_user_id) {
  try {
    const { data, error } = await supabase
      .from("student_course_module_class_progresses")
      .select("id,course_module_class_id")
      .eq("platform_user_id", platform_user_id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching student progress ids:", error);
    throw error;
  }
}

// % of progress in Course from User
export async function getPercentOfCompletionFromCourseAndUser(course_id, platform_user_id) {
  try {
    const courseModules = await getCourseModules(course_id);

    const allClasses = await Promise.all(
      courseModules.map(async (module) => {
        const moduleClasses = await getCourseModuleClass(module.id);
        return moduleClasses;
      })
    );
    
    const allClassesFlat = allClasses.flat();

    const studentProgress = await getStudentProgressIds(platform_user_id);
    const completedClassesIds = studentProgress.map(progress => progress.course_module_class_id);

    const completedClasses = allClassesFlat.filter(cls => completedClassesIds.includes(cls.id));

    const completionPercentage = (completedClasses.length / allClassesFlat.length) * 100;

    const completionPercentageFormatted = completionPercentage.toFixed(2);

    return completionPercentageFormatted;

  } catch (error) {
    console.error("Error calculating student progress:", error);
    throw error;
  }
}
