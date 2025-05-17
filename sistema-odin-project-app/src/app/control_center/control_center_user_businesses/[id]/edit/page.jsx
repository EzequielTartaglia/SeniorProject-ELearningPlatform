import EditControlCenterUserBusinessForm from "@/components/forms/control_center/control_center_user_businesses/EditControlCenterUserBusinessForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function EditPlatformUserBusiness({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[3,4]}
      ComponentIfUser={<EditControlCenterUserBusinessForm ControlCenterUserBusinessId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
