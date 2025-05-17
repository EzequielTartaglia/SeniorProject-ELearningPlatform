import ConditionalSessionControlCenterRender from "@/src/helpers/ConditionalSessionControlCenterRender";
import ControlCenterAuditDetails from "@/src/views/ControlCenter/Admin/Audits/Audit/ControlCenterAuditDetails";
import NotPermissionPageControlCenter from "@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter";

export default function ControlCenterAuditDetail({ params }) {
  return (
    <ConditionalSessionControlCenterRender
    AuthorizedUserRoles={[1, 2, 3, 4, 7]}
    enablePluginsRequireds={[1]}
      ComponentIfUser={
        <ControlCenterAuditDetails controlCenterAuditDocumentId={params.id} />
      }
      ComponentIfNoUser={<NotPermissionPageControlCenter />}
    />
  );
}
