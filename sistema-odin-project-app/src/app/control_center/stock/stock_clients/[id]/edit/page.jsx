import EditControlCenterStockClientForm from "@/components/forms/control_center/stock/cc_stock_clients/EditControlCenterStockClientForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function EditControlCenterClient({ params }) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[ 3, 4, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={
        <EditControlCenterStockClientForm
          controlCenterStockClientId={params.id}
        />
      }
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
