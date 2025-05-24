import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import ProfilePage from "@/src/views/Platform/User/Profile/ProfilePage";

export default function Profile() {
  return (
    <ConditionalSessionRender
      ComponentIfUser={<ProfilePage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
