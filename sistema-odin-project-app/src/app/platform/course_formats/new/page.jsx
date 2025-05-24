
import NewCoursesFormatPage from "@/src/views/Platform/CoursesFormatsPage/New/NewCoursesFormatPage";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function NewCoursesFormat() {
    return (
        <ConditionalSessionRender
            AuthorizedUserRoles={[3, 4]}
            ComponentIfUser={<NewCoursesFormatPage/>}
            ComponentIfNoUser={<NotPermissionPage/>}
        />
    );
}
