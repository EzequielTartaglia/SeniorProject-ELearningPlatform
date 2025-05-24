import AddPlatformUserBusinessForm from "@/components/forms/platform/platform_user_businesses/AddPlatformUserBusinessForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function AddPlatformUserBusiness() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[4,5]}
      ComponentIfUser={<AddPlatformUserBusinessForm />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
