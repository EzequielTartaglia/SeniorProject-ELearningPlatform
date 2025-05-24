import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import ControlCenterStockProvidersPage from "@/src/views/ControlCenter/Stock/Providers/ControlCenterStockProvidersPage";

export default function ControlCenterClients() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<ControlCenterStockProvidersPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
