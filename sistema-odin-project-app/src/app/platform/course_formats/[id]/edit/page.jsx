import CourseFormatEditDetailsPage from "@/src/views/Platform/CoursesFormatsPage/Edit/CourseFormatEditDetailsPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditCourseFormat({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <CourseFormatEditDetailsPage courseFormatId={params.id} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
