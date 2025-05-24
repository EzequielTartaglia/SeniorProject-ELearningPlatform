import CoursesPlatformToolsPage from "@/src/views/Platform/CoursesPlatformToolsPage/CoursesPlatformTools/CoursesPlatformToolsPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function CoursePlatformTools() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <CoursesPlatformToolsPage />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
