import AddCourseFinalExamQuestionAnswerForm from "@/components/forms/platform/courses/course_final_exams/course_final_exam_questions/course_final_exam_question_answers/AddCourseFinalExamQuestionAnswerForm";


export default function NewCourseFinalExamQuestionAnswerPage({
  courseId,
  courseFinalExamQuestionId,
}) {
  return  <AddCourseFinalExamQuestionAnswerForm
    courseId={courseId}
    courseFinalExamQuestionId={courseFinalExamQuestionId}
  />;
}
