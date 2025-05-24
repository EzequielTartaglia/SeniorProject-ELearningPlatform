import supabase from "@/utils/supabase/supabaseClient";

export async function getCourseFinalExamsQuestions() {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_questions")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseFinalExamQuestions(course_final_exam_id) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_questions")
      .select("*")
      .eq("course_final_exam_id", course_final_exam_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addCourseFinalExamQuestion(
  course_final_exam_id,
  question_text,
  points_assigned,
  has_image,
  question_image_link
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_questions")
      .insert({
        course_final_exam_id: course_final_exam_id,
        question_text: question_text,
        points_assigned: points_assigned,
        has_image: has_image,
        question_image_link: question_image_link
      });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseFinalExamQuestion(courseFinalExamQuestionId) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_questions")
      .select("*")
      .eq("id", courseFinalExamQuestionId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCourseFinalExamQuestion(
  courseFinalExamQuestionId,
  question_text,
  points_assigned,
  has_image,
  question_image_link
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_questions")
      .update({
        question_text: question_text,
        points_assigned: points_assigned,
        has_image: has_image,
        question_image_link: question_image_link
      })
      .eq("id", courseFinalExamQuestionId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseFinalExamQuestion(courseFinalExamQuestionId) {
  try {
    const { data: questionData, error: questionError } = await supabase
      .from("course_final_exam_questions")
      .select("course_final_exam_id")
      .eq("id", courseFinalExamQuestionId)
      .single();

    if (questionError) {
      throw questionError;
    }

    const courseFinalExamId = questionData.course_final_exam_id;

    const { data, error } = await supabase
      .from("course_final_exam_questions")
      .delete()
      .eq("id", courseFinalExamQuestionId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}
