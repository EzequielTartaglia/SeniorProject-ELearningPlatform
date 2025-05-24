import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import AdminUsersControlCenterPage from "@/src/views/ControlCenter/Users/UsersControlCenter/AdminUsersControlCenterPage";

export default function Users() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={<AdminUsersControlCenterPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
