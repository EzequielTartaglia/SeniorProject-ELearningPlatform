import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import ControlCenterStockClientsPage from "@/src/views/ControlCenter/Stock/Clients/ControlCenterStockClientsPage";

export default function ControlCenterClients() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<ControlCenterStockClientsPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
