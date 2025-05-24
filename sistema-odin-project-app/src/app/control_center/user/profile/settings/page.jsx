import EditControlCenterUserForm from "@/components/forms/control_center/users/EditControlCenterUserForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function ProfileSettings() {
  return (
    <ConditionalSessionControlCenterRender
      ComponentIfUser={<EditControlCenterUserForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
