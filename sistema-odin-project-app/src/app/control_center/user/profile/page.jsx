import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import ProfilePage from "@/src/views/ControlCenter/User/Profile/ProfilePage";

export default function Profile() {
  return (
    <ConditionalSessionControlCenterRender
      ComponentIfUser={<ProfilePage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
