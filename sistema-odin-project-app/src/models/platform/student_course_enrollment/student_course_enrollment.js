import formatDate from "@/src/helpers/formatDate";
import supabase from "@/utils/supabase/supabaseClient";

export async function getStudentCourseEnrollments() {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addStudentCourseEnrollment(
  platform_user_id,
  course_id,
  platform_state_id = 2,
  payment,
  enrollment_date = formatDate(new Date(), "yyyy-MM-dd"),
  currency_abbreviation
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .insert({
        platform_user_id: platform_user_id,
        course_id: course_id,
        platform_state_id: platform_state_id,
        payment: payment,
        enrollment_date: enrollment_date,
        currency_abbreviation: currency_abbreviation,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getStudentCourseEnrollment(student_course_enrollment_id) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .select("*")
      .eq("id", student_course_enrollment_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching student course enrollment:", error);
    throw error;
  }
}

export async function editStudentCourseEnrollment(
  student_course_enrollment_id,
  platform_user_id,
  course_id,
  platform_state_id,
  payment,
  currency_abbreviation
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .update({
        platform_user_id: platform_user_id,
        course_id: course_id,
        platform_state_id: platform_state_id,
        payment: payment,
        currency_abbreviation: currency_abbreviation
      })
      .eq("id", student_course_enrollment_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteStudentCourseEnrollment(
  student_course_enrollment_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .delete()
      .eq("id", student_course_enrollment_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editStudentCourseEnrollmentStatus(
  student_course_enrollment_id,
  platform_state_id
) {
  try {
    if (!platform_state_id) {
      throw new Error("Invalid platform_state_id");
    }
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .update({
        platform_state_id: platform_state_id,
      })
      .eq("id", student_course_enrollment_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

// Get all the courses enrolled for the student
export async function getStudentCourseEnrollmentsSingleUser(platform_user_id) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .select("*")
      .eq("platform_user_id", platform_user_id);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching student course enrollments:", error.message);
    throw error;
  }
}

// Get 1 course for 1 student
export async function getStudentCourseEnrollmentsSingleUserAndCourse(
  platform_user_id,
  course_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .select("*")
      .eq("course_id", course_id)
      .eq("platform_user_id", platform_user_id);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching student course enrollments:", error.message);
    throw error;
  }
}

// Verify if the user is enrollemented or not (returns true or false)
export async function checkStudentCourseEnrollment(
  platform_user_id,
  course_id
) {
  try {
    const { data, error } = await supabase
      .from("student_course_enrollments")
      .select("*")
      .eq("platform_user_id", platform_user_id)
      .eq("course_id", course_id)
      .single();

    if (error && error.message !== "No rows returned from your query") {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error checking student course enrollment:", error);
    throw error;
  }
}
