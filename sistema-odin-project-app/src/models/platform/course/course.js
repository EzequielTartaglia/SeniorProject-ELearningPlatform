import supabase from "@/utils/supabase/supabaseClient";
import { getCourseModules } from "../course_module/courses_module";
import { getCourseModuleClass } from "../course_module_class/course_module_class";

export async function getCourses() {
  try {
    const { data, error } = await supabase.from("courses").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCoursesNames() {
  try {
    const { data, error } = await supabase.from("courses").select("id, name");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseModulesAndClasses(courseId) {
  try {
    const courseModules = await getCourseModules(courseId);

    const modulesWithClasses = await Promise.all(
      courseModules.map(async (module) => {
        const moduleClasses = await getCourseModuleClass(module.id);
        return { module, moduleClasses };
      })
    );

    return modulesWithClasses;
  } catch (error) {
    throw error;
  }
}

export async function addCourse(
  name,
  has_final_exam,
  is_paid,
  payment_methods,
  course_level_id,
  description,
  image_preview_link
) {
  try {
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .insert({
        name: name,
        has_final_exam: has_final_exam,
        is_paid: is_paid,
        payment_methods: payment_methods,
        course_level_id: course_level_id,
        description: description,
        image_preview_link: image_preview_link
      })
      .select();

    if (courseError) {
      throw courseError;
    }

    if (has_final_exam && courseData && courseData.length > 0) {
      const courseId = courseData[0].id;
      const { data: examData, error: examError } = await supabase
        .from("course_final_exams")
        .insert({ course_id: courseId, title: "Examen Final" });

      if (examError) {
        throw examError;
      }
    }

    return courseData;
  } catch (error) {
    throw error;
  }
}

export async function getCourse(courseId) {
  try {
    const { data: courseData, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) {
      throw error;
    }

    const paymentMethods = await getCoursePaymentMethods(courseId); 
    if (paymentMethods) {
      courseData.payment_methods = paymentMethods;
    }

    return courseData;
  } catch (error) {
    throw error;
  }
}


export async function getCoursePaymentMethods(courseId) {
  try {
    const { data: courseData, error } = await supabase
      .from("courses")
      .select("*")
      .eq("id", courseId)
      .single();

    if (error) {
      throw error;
    }

    // Asegúrate de retornar los payment_methods si existen en el curso
    const paymentMethods = courseData ? courseData.payment_methods : [];
    return paymentMethods;
  } catch (error) {
    throw error;
  }
}

export async function editCourse(
  courseId,
  name,
  has_final_exam,
  is_paid,
  payment_methods,
  course_level_id,
  description,
  image_preview_link
) {
  try {
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .update({
        name: name,
        has_final_exam: has_final_exam,
        is_paid: is_paid,
        payment_methods: payment_methods,
        course_level_id: course_level_id,
        description: description,
        image_preview_link: image_preview_link
      })
      .eq("id", courseId)
      .select();

    if (courseError) {
      throw courseError;
    }

    if (has_final_exam) {
      const { data: finalExamData, error: finalExamError } = await supabase
        .from("course_final_exams")
        .select()
        .eq("course_id", courseId);

      if (finalExamError) {
        throw finalExamError;
      }

      // If no final exam exists, create one
      if (finalExamData.length === 0) {
        const { data: newExamData, error: newExamError } = await supabase
          .from("course_final_exams")
          .insert({ course_id: courseId, title: "Examen Final" });

        if (newExamError) {
          throw newExamError;
        }
      }
    }

    return courseData;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourse(courseId) {
  try {
    const { data, error } = await supabase
      .from("courses")
      .delete()
      .eq("id", courseId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Time to complete the course
export async function getTotalTimeToComplete(courseId) {
  try {
    const modules = await getCourseModules(courseId);

    if (!modules.length) {
      return 0;
    }

    const moduleIds = modules.map(module => module.id);

    const { data, error } = await supabase
      .from("course_module_classes")
      .select("time_to_complete")
      .in("course_module_id", moduleIds);

    if (error) {
      throw error;
    }

    const totalTime = data.reduce((sum, item) => sum + item.time_to_complete, 0);

    return totalTime;
  } catch (error) {
    throw error;
  }
}
