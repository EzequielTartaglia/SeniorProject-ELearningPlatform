import EditAuditDocumentTemplateSectionForm from "@/components/forms/control_center/cc_audit_document_template_sections/EditAuditDocumentTemplateSectionForm";
import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function EditAuditDocumentTemplateSection({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[2, 3, 4, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<EditAuditDocumentTemplateSectionForm auditDocumentId={params.id} auditDocumentTemplateSectionId={params.auditDocumentTemplateSectionId}/>}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
