import ManagePlatformUserBusinessPluginsForm from "@/components/forms/control_center/control_center_user_businesses/ManagePlatformUserBusinessPluginsForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function ManagePlatformUserBusinessPlugins({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3,4]}
      ComponentIfUser={<ManagePlatformUserBusinessPluginsForm ControlCenterUserBusinessId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
