import supabase from "@/utils/supabase/supabaseClient";

export async function getStudentCourseEnrollmentFinalExamAttemptTries() {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempt_tries")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addStudentCourseEnrollmentFinalExamAttemptTry(
  student_course_enrollment_final_exam_attempt_id,
  score,
  answers
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempt_tries")
      .insert({
        student_course_enrollment_final_exam_attempt_id:
          student_course_enrollment_final_exam_attempt_id,
        score: score,
        answers: answers,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getStudentCourseEnrollmentFinalExamAttemptTriesFromEnrollment(
  student_course_enrollment_final_exam_attempt_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempt_tries")
      .select("*")
      .eq("student_course_enrollment_final_exam_attempt_id", student_course_enrollment_final_exam_attempt_id);

    if (error) {
      throw error;
    }

    return data; 
  } catch (error) {
    console.error(
      "Error fetching student course enrollment final exam attempt try:",
      error.message
    );
    throw error;
  }
}

export async function getStudentCourseEnrollmentFinalExamAttemptTry(
  student_course_enrollment_final_exam_attempt_try_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempt_tries")
      .select("*")
      .eq("id", student_course_enrollment_final_exam_attempt_try_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "Error fetching student course enrollment final exam attempt try:",
      error
    );
    throw error;
  }
}

export async function editStudentCourseEnrollmentFinalExamAttemptTry(
  student_course_enrollment_final_exam_attempt_try_id,
  student_course_enrollment_final_exam_attempt_id,
  score,
  answers
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempt_tries")
      .update({
        student_course_enrollment_final_exam_attempt_id: student_course_enrollment_final_exam_attempt_id,
        score: score,
        answers: answers,
      })
      .eq("id", student_course_enrollment_final_exam_attempt_try_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteStudentCourseEnrollmentFinalExamAttempt(
  student_course_enrollment_final_exam_attempt_try_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempt_tries")
      .delete()
      .eq("id", student_course_enrollment_final_exam_attempt_try_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
