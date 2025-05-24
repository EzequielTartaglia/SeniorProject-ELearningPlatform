import NewCourseModulePage from "@/src/views/Platform/CoursesPage/Course[id]/Module/[moduleId]/New/NewCourseModulePage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function AddCourseModules({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <NewCourseModulePage courseId={params.id} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
