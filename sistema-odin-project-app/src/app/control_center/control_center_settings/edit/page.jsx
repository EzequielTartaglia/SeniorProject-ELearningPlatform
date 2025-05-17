import EditControlCenterSettingsForm from '@/components/forms/control_center/control_center_settings/EditControlCenterSettingsForm'
import ConditionalSessionControlCenterRender from '@/src/helpers/ConditionalSessionControlCenterRender'
import NotPermissionPageControlCenter from '@/src/views/ControlCenter/NotPermissionPage/NotPermissionPageControlCenter'


export default function EditControlCenterSettings() {
  return (
    <ConditionalSessionControlCenterRender
AuthorizedUserRoles={[3,4]}
ComponentIfUser={<EditControlCenterSettingsForm/>}
ComponentIfNoUser={<NotPermissionPageControlCenter />}
/>
  )
}
