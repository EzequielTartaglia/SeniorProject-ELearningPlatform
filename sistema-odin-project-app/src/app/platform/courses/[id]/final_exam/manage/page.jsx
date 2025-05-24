import CourseFinalExamManagePage from "@/src/views/Platform/CoursesPage/Course[id]/FinalExamPage/Course[id]FinalExamManagePage/CourseFinalExamManagePage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function CourseFinalExamManage({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <CourseFinalExamManagePage courseId={params.id} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
