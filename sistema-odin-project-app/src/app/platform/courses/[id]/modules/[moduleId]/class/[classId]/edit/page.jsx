import EditModuleCourseClassPage from "@/src/views/Platform/CoursesPage/Course[id]/Module/Class/[classId]/Edit/EditModuleCourseClassPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditCourseModuleClass({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <EditModuleCourseClassPage courseId={params.id} moduleId={params.moduleId} classId={params.classId} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
