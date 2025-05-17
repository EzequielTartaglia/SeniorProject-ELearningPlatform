import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import StockProductMeasureUnitsPage from "@/src/views/ControlCenter/Stock/ProductMeasureUnits/StockProductMeasureUnitsPage";

export default function ProductCategories() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<StockProductMeasureUnitsPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
