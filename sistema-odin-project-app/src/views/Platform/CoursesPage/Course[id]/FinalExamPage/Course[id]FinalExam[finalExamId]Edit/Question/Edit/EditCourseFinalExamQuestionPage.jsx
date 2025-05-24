import EditCourseFinalExamQuestionForm from "@/components/forms/platform/courses/course_final_exams/course_final_exam_questions/EditCourseFinalExamQuestionForm";

export default function EditCourseFinalExamQuestionPage({
  courseId,
  questionId,
  answerId
}) {
  return (
    <EditCourseFinalExamQuestionForm
      courseId={courseId}
      questionId={questionId}
      answerId={answerId}
    />
  );
}
