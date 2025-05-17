
import TryStudentFinalExamAttemptForm from "@/components/forms/platform/courses/course_final_exams/student_final_exam_attempt_tries/TryStudentFinalExamAttemptForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";


export default function FinalExamAttemptNewTry({ params }) {
  return (
    <ConditionalSessionRender
      ComponentIfUser={
        <TryStudentFinalExamAttemptForm
          courseId={params.id}
          finalExamId={params.finalExamId}
          attemptId={params.attemptId}
        />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
