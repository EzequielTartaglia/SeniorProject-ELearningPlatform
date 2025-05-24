import AddControlCenterStockProviderForm from "@/components/forms/control_center/stock/cc_stock_providers/AddControlCenterStockProviderForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddControlCenterClient() {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[ 3, 4, 6, 7]}
    enablePluginsRequireds={[2]}
      ComponentIfUser={<AddControlCenterStockProviderForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
