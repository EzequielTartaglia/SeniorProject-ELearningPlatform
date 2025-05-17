import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import StockProductMeasureUnitDetailsPage from "@/src/views/ControlCenter/Stock/ProductMeasureUnits/MeasureUnit/StockProductMeasureUnitDetailsPage";

export default function ProductMeasureUnit({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4, 5, 6, 7]}
      enablePluginsRequireds={[2]}
      ComponentIfUser={<StockProductMeasureUnitDetailsPage stockProductMeasureUnitId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
