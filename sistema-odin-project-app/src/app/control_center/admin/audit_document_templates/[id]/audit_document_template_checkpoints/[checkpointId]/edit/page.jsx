import EditAuditDocumentTemplateCheckpointForm from "@/components/forms/control_center/cc_audit_document_template_checkpoints/EditAuditDocumentTemplateCheckpointForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddAuditDocumentTemplateCheckpoint({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[2, 3, 4, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<EditAuditDocumentTemplateCheckpointForm auditDocumentId={params.id} auditDocumentCheckpointId={params.checkpointId}/>}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
