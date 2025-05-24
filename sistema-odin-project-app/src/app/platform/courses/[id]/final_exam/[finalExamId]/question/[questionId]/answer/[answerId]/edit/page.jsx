import EditCourseFinalExamQuestionAnswerPage from "@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/Course[id]FinalExam[finalExamId]Edit/Question/Answer/Edit/EditCourseFinalExamQuestionAnswerPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditCourseFinalExamQuestionAnswer({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <EditCourseFinalExamQuestionAnswerPage courseId={params.id}
    questionId={params.questionId} answerId={params.answerId}/>
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
