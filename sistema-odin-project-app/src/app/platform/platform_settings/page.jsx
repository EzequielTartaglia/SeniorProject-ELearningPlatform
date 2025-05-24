import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import PlatformSettingsPage from "@/src/views/Platform/PlatformSettings/PlatformSettingsPage";

export default function PlatformSettings() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={<PlatformSettingsPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
