import EditCourseFinalExamQuestionAnswerForm from "@/components/forms/platform/courses/course_final_exams/course_final_exam_questions/course_final_exam_question_answers/EditCourseFinalExamQuestionAnswerForm";

export default function EditCourseFinalExamQuestionAnswerPage({
  courseId,
  questionId,
  answerId,
}) {
  return <EditCourseFinalExamQuestionAnswerForm courseId={courseId} questionId={questionId} answerId={answerId}
/>;
}
