import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import AuditDocumentTemplateSectionsPage from "@/src/views/ControlCenter/Admin/AuditDocumentTemplates/DocumentTemplate/Sections/AuditDocumentTemplateSectionsPage";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AuditDocumentTemplateSections({params}) {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[1, 2, 3, 4, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<AuditDocumentTemplateSectionsPage auditDocumentId={params.id} />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
