

import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import StudentFinalExamAttemptTryPage from "@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/FinalExamAttempt/AttemptTry/StudentFinalExamAttemptTryPage/StudentFinalExamAttemptTryPage";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";


export default function FinalExamAttemptNewTry({ params }) {
  return (
    <ConditionalSessionRender
      ComponentIfUser={
        <StudentFinalExamAttemptTryPage
          courseId={params.id}
          finalExamId={params.finalExamId}
          attemptId={params.attemptId}
          attemptTryId={params.attemptTryId}
        />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
