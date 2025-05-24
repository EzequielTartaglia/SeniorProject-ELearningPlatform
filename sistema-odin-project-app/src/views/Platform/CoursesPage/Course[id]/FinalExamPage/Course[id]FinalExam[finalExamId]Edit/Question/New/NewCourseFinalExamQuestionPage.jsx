import AddCourseFinalExamQuestionForm from "@/components/forms/platform/courses/course_final_exams/course_final_exam_questions/AddCourseFinalExamQuestionForm";

export default function NewCourseFinalExamQuestionPage({
  courseId,
  finalExamId,
}) {
  return  <AddCourseFinalExamQuestionForm
    courseId={courseId}
    finalExamId={finalExamId}
  />;
}
