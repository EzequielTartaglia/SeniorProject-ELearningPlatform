import NewCoursePage from "@/src/views/Platform/CoursesPage/New/NewCoursePage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function NewCourse() {
    return (
        <ConditionalSessionRender
            AuthorizedUserRoles={[3, 4]}
            ComponentIfUser={<NewCoursePage/>}
            ComponentIfNoUser={<NotPermissionPage/>}
        />
    );
}
