import EditStockProductForm from "@/components/forms/control_center/stock/stock_products/EditStockProductForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function EditProductMeasureUnit({ params }) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<EditStockProductForm stockProductId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
