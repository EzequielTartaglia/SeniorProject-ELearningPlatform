import CoursePlatformToolEditDetailsPage from "@/src/views/Platform/CoursesPlatformToolsPage/Edit/CoursePlatformToolEditDetailsPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditCoursePlatformTool({ params }) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={
        <CoursePlatformToolEditDetailsPage coursePlatformToolId={params.id} />
      }
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
