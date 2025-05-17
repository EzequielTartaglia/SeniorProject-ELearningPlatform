import AddStockProductForm from "@/components/forms/control_center/stock/stock_products/AddStockProductForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddProduct() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<AddStockProductForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
