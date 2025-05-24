import AddStockProductMeasureUnitForm from "@/components/forms/control_center/stock/product_measure_units/AddStockProductMeasureUnitForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function NewProductCategory() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<AddStockProductMeasureUnitForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
