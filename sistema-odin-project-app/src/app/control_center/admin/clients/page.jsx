import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import ControlCenterClientsPage from "@/src/views/ControlCenter/Admin/Clients/ControlCenterClientsPage";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function ControlCenterClients() {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[1, 2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<ControlCenterClientsPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
