import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import StockProductCategoriesPage from "@/src/views/ControlCenter/Stock/ProductCategories/StockProductCategoriesPage";

export default function ProductCategories() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<StockProductCategoriesPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
