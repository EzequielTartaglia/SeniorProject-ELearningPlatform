import NewCourseModuleClassPage from "@/src/views/Platform/CoursesPage/Course[id]/Module/Class/[classId]/New/NewCourseModuleClassPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function AddCourseModuleClasses({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <NewCourseModuleClassPage courseId={params.id} moduleId={params.moduleId} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
