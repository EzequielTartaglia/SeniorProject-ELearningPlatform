import CourseDetailsPage from "@/src/views/Platform/CoursesPage/Course[id]/CourseDetailsPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function Course({ params }) {
  return (
    <ConditionalSessionRender
      ComponentIfUser={
        <CourseDetailsPage courseId={params.id} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
