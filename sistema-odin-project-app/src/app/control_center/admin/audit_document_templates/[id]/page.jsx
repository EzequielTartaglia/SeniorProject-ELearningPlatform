import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import AuditDocumentTemplateDetailsPage from "@/src/views/ControlCenter/Admin/AuditDocumentTemplates/DocumentTemplate/AuditDocumentTemplateDetailsPage";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AuditDocumentTemplateDetails({params}) {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[1, 2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={<AuditDocumentTemplateDetailsPage auditDocumentId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
