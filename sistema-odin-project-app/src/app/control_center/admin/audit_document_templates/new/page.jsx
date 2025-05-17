import AddAuditDocumentTemplateForm from "@/components/forms/control_center/cc_audit_document_templates/AddAuditDocumentTemplateForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddAuditDocumentTemplate() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[2, 3, 4, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<AddAuditDocumentTemplateForm />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
