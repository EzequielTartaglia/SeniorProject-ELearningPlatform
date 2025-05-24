import NewCourseFinalExamQuestionAnswerPage from '@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/Course[id]FinalExam[finalExamId]Edit/Question/Answer/New/NewCourseFinalExamQuestionAnswerPage'
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function NewCourseFinalExamQuestion({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <NewCourseFinalExamQuestionAnswerPage courseId={params.id}
    courseFinalExamQuestionId={params.questionId}/>
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
