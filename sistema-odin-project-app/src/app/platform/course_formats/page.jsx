import CoursesFormatsPage from "@/src/views/Platform/CoursesFormatsPage/CoursesFormats/CoursesFormatsPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function CourseFormats() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <CoursesFormatsPage/>
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
