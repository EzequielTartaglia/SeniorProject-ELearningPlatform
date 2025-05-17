import ChangePasswordControlCenterForm from "@/components/forms/login/ChangePasswordControlCenterForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";


export default function ChangePassword() {
  return (
    <ConditionalSessionControlCenterRender
      ComponentIfUser={<ChangePasswordControlCenterForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
