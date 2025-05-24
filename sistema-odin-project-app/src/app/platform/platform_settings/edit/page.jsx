import EditPlatformSettingsForm from '@/components/forms/platform/platform_settings/EditPlatformSettingsForm'
import ConditionalSessionRender from '@/src/helpers/ConditionalSessionRender'
import NotPermissionPage from '@/src/views/Platform/NotPermissionPage/NotPermissionPage'
import React from 'react'

export default function EditPlatformSettings() {
  return (
    <ConditionalSessionRender
AuthorizedUserRoles={[3,4,6]}
ComponentIfUser={<EditPlatformSettingsForm/>}
ComponentIfNoUser={<NotPermissionPage />}
/>
  )
}
