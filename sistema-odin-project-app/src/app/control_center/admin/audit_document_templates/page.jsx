import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import AuditDocumentTemplatesPage from "@/src/views/ControlCenter/Admin/AuditDocumentTemplates/AuditDocumentTemplatesPage";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function AuditDocumentTemplates() {
  return (
    <ConditionalSessionControlCenterRender
      AuthorizedUserRoles={[1, 2, 3, 4, 7]}
      enablePluginsRequireds={[1]}
      ComponentIfUser={<AuditDocumentTemplatesPage />}
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
