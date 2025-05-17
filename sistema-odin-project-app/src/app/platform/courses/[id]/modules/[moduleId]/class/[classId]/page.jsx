import CourseModuleClassDetailsPage from "@/src/views/Platform/CoursesPage/Course[id]/Module/Class/[classId]/CourseModuleClassDetailsPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function CourseModuleClass({ params }) {
  return (
    <ConditionalSessionRender
      ComponentIfUser={
        <CourseModuleClassDetailsPage courseId={params.id} moduleId={params.moduleId} classId={params.classId} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
