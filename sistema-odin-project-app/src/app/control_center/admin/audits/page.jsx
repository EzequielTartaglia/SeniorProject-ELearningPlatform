import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import ControlCenterAuditsPage from "@/src/views/ControlCenter/Admin/Audits/ControlCenterAuditsPage";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function ControlCenterAudits() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[1, 2, 3, 4, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<ControlCenterAuditsPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
