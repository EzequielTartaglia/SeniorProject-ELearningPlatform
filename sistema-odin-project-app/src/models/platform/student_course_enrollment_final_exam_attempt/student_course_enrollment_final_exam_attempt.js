import formatDate from "@/src/helpers/formatDate";
import supabase from "@/utils/supabase/supabaseClient";

export async function getStudentCourseEnrollmentFinalExamAttempts() {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addStudentCourseEnrollmentFinalExamAttempt(
  attempts_count_period,
  total_attempts,
  best_score,
  student_course_enrollment_id,
  is_lock
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .insert({
        attempts_count_period: attempts_count_period,
        total_attempts: total_attempts,
        best_score: best_score,
        student_course_enrollment_id: parseInt(student_course_enrollment_id),
        is_lock: is_lock,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getStudentCourseEnrollmentFinalExamAttempt(
  student_course_enrollment_final_exam_attempt_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .select("*")
      .eq("id", student_course_enrollment_final_exam_attempt_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(
      "Error fetching student course enrollment final exam attempt:",
      error
    );
    throw error;
  }
}

export async function editStudentCourseEnrollmentFinalExamAttempt(
  student_course_enrollment_final_exam_attempt_id,
  total_attempts,
  attempts_count_period,
  best_score,
  student_course_enrollment_id,
  is_lock,
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .update({
        total_attempts: total_attempts,
        attempts_count_period: attempts_count_period,
        best_score: best_score,
        student_course_enrollment_id: student_course_enrollment_id,
        is_lock: is_lock,
      })
      .eq("id", student_course_enrollment_final_exam_attempt_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteStudentCourseEnrollmentFinalExamAttempt(
  student_course_enrollment_final_exam_attempt_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .delete()
      .eq("id", student_course_enrollment_final_exam_attempt_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}


export async function checkStudentCourseEnrollmentFinalExamAttempt(student_course_enrollment_id) {
  try {
    const { data, error, count } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .select("*", { count: 'exact' })
      .eq("student_course_enrollment_id", student_course_enrollment_id)
      .order('created_at', { ascending: true }); 

    if (error) {
      throw new Error(`Error fetching record: ${error.message}`);
    }

    if (count === 0) {
      return null; 
    }

    if (count > 1) {
      const latestAttemptId = data[data.length - 1].id;
      const deleteResult = await supabase
        .from("student_course_enrollment_final_exam_attempts")
        .delete()
        .eq("id", latestAttemptId);

      if (deleteResult.error) {
        throw new Error(`Error deleting latest attempt: ${deleteResult.error.message}`);
      }

      return data[0];
    }

    return data[0];  
  } catch (error) {
    console.error("Error fetching student course enrollment final exam attempt:", error);
    throw error;
  }
}


export async function updateStudentCourseEnrollmentFinalExamAttemptBestScore(
  student_course_enrollment_final_exam_attempt_id,
  best_score
) {
  try {
    const { data: currentData, error: fetchError } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .select("*")
      .eq("id", student_course_enrollment_final_exam_attempt_id)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    const currentBestScore = currentData.best_score;

    if (best_score > currentBestScore) {
      const { data, error } = await supabase
        .from("student_course_enrollment_final_exam_attempts")
        .update({
          best_score: best_score,
        })
        .eq("id", student_course_enrollment_final_exam_attempt_id);

      if (error) {
        throw error;
      }
      return data;
    } else {
      return currentData;
    }
  } catch (error) {
    throw error;
  }
}


export async function checkExpirationDate() {
  try {
    const today = formatDate(new Date(), "yyyy-MM-dd");

    const { data, error } = await supabase
      .from("student_course_enrollment_final_exam_attempts")
      .update({
        lock_expiration_date: null,
        attempts_count_period: 0,
        is_lock: false,
      })
      .lt("lock_expiration_date", today)
      .eq("is_approved", false);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error updating expiration dates:", error);
    throw error;
  }
}