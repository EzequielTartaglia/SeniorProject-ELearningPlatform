import EditPlatformUserBusinessForm from "@/components/forms/platform/platform_user_businesses/EditPlatformUserBusinessForm";
import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";

export default function EditPlatformUserBusiness({params}) {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[4,5]}
      ComponentIfUser={<EditPlatformUserBusinessForm platformUserBusinessId={params.id} />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
