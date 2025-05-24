import AddControlCenterUserBusinessForm from "@/components/forms/control_center/control_center_user_businesses/AddControlCenterUserBusinessForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddPlatformUserBusiness() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[4,5]}
      ComponentIfUser={<AddControlCenterUserBusinessForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
