import NewCoursesPlatformToolPage from "@/src/views/Platform/CoursesPlatformToolsPage/New/NewCoursesPlatformToolPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function NewCoursesPlatformTool() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <NewCoursesPlatformToolPage />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
