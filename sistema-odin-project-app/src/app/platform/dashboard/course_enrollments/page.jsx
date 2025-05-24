import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import DashboardPage from "@/src/views/Platform/Dashboard/DashboardPage";

export default function Dashboad() {
    return (
        <ConditionalSessionRender
            AuthorizedUserRoles={[3, 4]}
            ComponentIfUser={<DashboardPage/>}
            ComponentIfNoUser={<NotPermissionPage/>}
        />
    );
}
