import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import ControlCenterClientDetailsPage from "@/src/views/ControlCenter/Admin/Clients/Client/ControlCenterClientDetailsPage";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function ControlCenterClientDetails({params}) {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[1, 2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<ControlCenterClientDetailsPage controlCenterClientId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
