import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import AdminCourseEnrollmentsPage from "@/src/views/Platform/Admin/AdminCourseEnrollments/AdminCourseEnrollmentsPage";

export default function Enrollements() {
    return (
        <ConditionalSessionRender
            AuthorizedUserRoles={[3, 4]}
            ComponentIfUser={<AdminCourseEnrollmentsPage/>}
            ComponentIfNoUser={<NotPermissionPage/>}   
        />
    );
}
