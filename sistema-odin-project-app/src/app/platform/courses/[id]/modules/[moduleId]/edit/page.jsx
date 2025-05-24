import EditModuleCoursePage from "@/src/views/Platform/CoursesPage/Course[id]/Module/[moduleId]/Edit/EditModuleCoursePage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditCourseModules({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <EditModuleCoursePage courseId={params.id} moduleId={params.moduleId} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
