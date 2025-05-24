import EditStockProductCategoryForm from "@/components/forms/control_center/stock/stock_product_categories/EditStockProductCategoryForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function EditProductCategory({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<EditStockProductCategoryForm stockProductCategoryId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
