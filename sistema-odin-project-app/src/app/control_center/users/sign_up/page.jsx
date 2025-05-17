import SignUpControlCenterForm from "@/components/forms/login/SignUpControlCenterForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function SignUpControlCenter() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={<SignUpControlCenterForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
