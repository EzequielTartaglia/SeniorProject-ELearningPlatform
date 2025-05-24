import EditUserForm from "@/components/forms/platform/users/EditUserForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function ProfileSettings() {
  return (
    <ConditionalSessionRender
      ComponentIfUser={<EditUserForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
