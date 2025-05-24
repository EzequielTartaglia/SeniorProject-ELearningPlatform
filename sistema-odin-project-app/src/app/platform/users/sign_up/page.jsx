import SignUpForm from "@/components/forms/login/SignUpForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function SignUp() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={<SignUpForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
