import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";
import ControlCenterUserBusinessesPage from "@/src/views/ControlCenter/UserBussiness/ControlCenterUserBusinessesPage";

export default function Users() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={<ControlCenterUserBusinessesPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
