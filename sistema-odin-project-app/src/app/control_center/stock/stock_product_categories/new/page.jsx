import AddStockProductCategoryForm from "@/components/forms/control_center/stock/stock_product_categories/AddStockProductCategoryForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function NewProductCategory() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<AddStockProductCategoryForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
