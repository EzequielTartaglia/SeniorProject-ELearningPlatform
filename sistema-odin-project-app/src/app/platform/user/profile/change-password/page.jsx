import ChangePasswordForm from "@/components/forms/login/ChangePasswordForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";


export default function ChangePassword() {
  return (
    <ConditionalSessionRender
      ComponentIfUser={<ChangePasswordForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
