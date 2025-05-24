import AddControlCenterClientForm from "@/components/forms/control_center/cc_clients/AddControlCenterClientForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddControlCenterClient() {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<AddControlCenterClientForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
