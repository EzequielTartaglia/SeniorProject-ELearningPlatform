import EditCourseFinalExamQuestionPage from '@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/Course[id]FinalExam[finalExamId]Edit/Question/Edit/EditCourseFinalExamQuestionPage';
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditCourseFinalExamQuestion({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <EditCourseFinalExamQuestionPage courseId={params.id} finalExamId={params.finalExamId} questionId={params.questionId} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
