import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import PlatformUserBusinessesPage from "@/src/views/Platform/UserBussiness/PlatformUserBusinessesPage";

export default function PlatformUserBusinesses() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[4,5]}
      ComponentIfUser={<PlatformUserBusinessesPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
