import EditCourseFinalExamPage from "@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/Course[id]FinalExam[finalExamId]Edit/EditCourseFinalExamPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditCourseFinalExam({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <EditCourseFinalExamPage courseId={params.id} finalExamId={params.finalExamId} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
