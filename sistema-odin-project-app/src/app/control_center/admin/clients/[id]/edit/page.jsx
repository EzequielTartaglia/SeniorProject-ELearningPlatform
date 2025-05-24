import EditControlCenterClientForm from "@/components/forms/control_center/cc_clients/EditControlCenterClientForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function EditControlCenterClient({params}) {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<EditControlCenterClientForm controlCenterClientId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
