import AddControlCenterAuditForm from "@/components/forms/control_center/cc_audit_documents/AddControlCenterAuditForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddControlCenterAudit() {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[1, 2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<AddControlCenterAuditForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
