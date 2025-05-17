import EditControlCenterAuditForm from "@/components/forms/control_center/cc_audit_documents/EditControlCenterAuditForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function EditControlCenterAudit({params}) {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<EditControlCenterAuditForm controlCenterAuditDocumentId={params.id}/>}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
