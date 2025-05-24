import NewCourseFinalExamQuestionPage from "@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/Course[id]FinalExam[finalExamId]Edit/Question/New/NewCourseFinalExamQuestionPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function NewCourseFinalExamQuestion({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <NewCourseFinalExamQuestionPage courseId={params.id} finalExamId={params.finalExamId} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
