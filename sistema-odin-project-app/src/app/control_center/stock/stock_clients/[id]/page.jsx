import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import ControlCenterStockClientDetailsPage from "@/src/views/ControlCenter/Stock/Clients/Client/ControlCenterStockClientDetailsPage";

export default function ControlCenterClientDetails({ params }) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={
        <ControlCenterStockClientDetailsPage
          controlCenterStockClientId={params.id}
        />
      }
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
