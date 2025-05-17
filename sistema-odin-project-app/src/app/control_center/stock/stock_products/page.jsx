import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import StockProductsPage from "@/src/views/ControlCenter/Stock/StockProducts/StockProductsPage";

export default function Products() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<StockProductsPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
