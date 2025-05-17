import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import ControlCenterSettingsPage from "@/src/views/ControlCenter/ControlCenterSettings/ControlCenterSettingsPage";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function ControlCenterSettings() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3,4]}
      ComponentIfUser={<ControlCenterSettingsPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
