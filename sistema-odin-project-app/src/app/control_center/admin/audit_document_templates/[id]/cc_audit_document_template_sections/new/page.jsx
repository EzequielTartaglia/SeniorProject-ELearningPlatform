import AddAuditDocumentTemplateSectionForm from "@/components/forms/control_center/cc_audit_document_template_sections/AddAuditDocumentTemplateSectionForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AddAuditDocumentTemplateSection({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[2, 3, 4, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<AddAuditDocumentTemplateSectionForm auditDocumentId={params.id}/>}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
