import supabase from "@/utils/supabase/supabaseClient";

export async function getFinalExamQuestionsAndOptions(course_final_exam_id) {
  try {
    const { data, error } = await supabase
      .from('course_final_exam_questions')
      .select(`
        *,
        course_final_exam_option_answers (*)
      `)
      .eq('course_final_exam_id', course_final_exam_id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}


export async function addCourseFinalExamOptionsAnswer(
  course_final_exam_question_id,
  answer_text,
  is_correct
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_option_answers")
      .insert({
        course_final_exam_question_id: course_final_exam_question_id,
        answer_text: answer_text,
        is_correct: is_correct,
      });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCourseFinalExamOptionAnswer(
  courseFinalExamOptionAnswerId
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_option_answers")
      .select("*")
      .eq("id", courseFinalExamOptionAnswerId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCourseFinalExamOptionAnswer(
  courseFinalExamOptionAnswerId,
  answer_text,
  is_correct
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_option_answers")
      .update({ answer_text: answer_text, is_correct: is_correct })
      .eq("id", courseFinalExamOptionAnswerId);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCourseFinalExamQuestionAnswer(
  courseFinalExamOptionAnswerId
) {
  try {
    const { data, error } = await supabase
      .from("course_final_exam_option_answers")
      .delete()
      .eq("id", courseFinalExamOptionAnswerId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
