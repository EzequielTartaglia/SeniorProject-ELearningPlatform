import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import ControlCenterStockClientDetailsPage from "@/src/views/ControlCenter/Stock/Clients/Client/ControlCenterStockClientDetailsPage";
import ControlCenterStockProviderDetailsPage from "@/src/views/ControlCenter/Stock/Providers/Provider/ControlCenterStockProviderDetailsPage";

export default function ControlCenterClientDetails({ params }) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={
        <ControlCenterStockProviderDetailsPage
          controlCenterStockProviderId={params.id}
        />
      }
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
