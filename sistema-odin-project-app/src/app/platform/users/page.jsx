import ConditionalSessionRender from "@/src/helpers/ConditionalSessionRender";
import NotPermissionPage from "@/src/views/Platform/NotPermissionPage/NotPermissionPage";
import UsersPage from "@/src/views/Platform/Users/UsersPage/UsersPage";

export default function Users() {
  return (
    <ConditionalSessionRender
      AuthorizedUserRoles={[3, 4]}
      ComponentIfUser={<UsersPage />}
      ComponentIfNoUser={<NotPermissionPage />}
    />
  );
}
