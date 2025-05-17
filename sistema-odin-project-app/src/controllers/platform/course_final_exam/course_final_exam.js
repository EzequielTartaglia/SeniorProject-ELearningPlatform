import supabase from "@/utils/supabase/supabaseClient";

export async function getCourseFinalExams() {
  try {
    const { data, error } = await supabase
      .from("course_final_exams")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseFinalExam(courseId) {
  try {
    const { data: courseFinalExam, error } = await supabase
      .from("course_final_exams")
      .select("*")
      .eq("course_id", courseId)
      .single();

    if (error) {
      throw error;
    }

    if (!courseFinalExam) {
      throw new Error(`Final exam to course "${courseId}" not found`);
    }

    return courseFinalExam;
  } catch (error) {
    console.error("Error on getCourseFinalExam:", error.message);
  }
}

export async function addCourseFinalExam(
  course_id,
  title,
  description,
  min_score_to_pass
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exams")
      .insert({
        title: title,
        description: description,
        min_score_to_pass: min_score_to_pass,
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

export async function editCourseFinalExam(
  courseFinalExamId,
  title,
  description,
  min_score_to_pass
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exams")
      .update({
        title: title,
        description: description,
        min_score_to_pass: min_score_to_pass,
      })
      .eq("id", courseFinalExamId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseModule(courseFinalExamId) {
  try {
    const { data, error } = await supabase
      .from("course_final_exams")
      .delete()
      .eq("id", courseFinalExamId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
