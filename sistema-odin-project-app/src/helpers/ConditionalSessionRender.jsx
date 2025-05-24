"use client";

import { useUserInfoContext } from "@/contexts/UserInfoContext";

const ConditionalSessionRender = ({ ComponentIfUser, ComponentIfNoUser, AuthorizedUserRoles }) => {
    const { user } = useUserInfoContext();

    if (!user) {
        console.log('No user found');
        return ComponentIfNoUser;
    }

    const userRoles = Array.isArray(user.user_role_id) ? user.user_role_id : [user.user_role_id];

    if (AuthorizedUserRoles && AuthorizedUserRoles.length > 0) {
        const hasRequiredRole = AuthorizedUserRoles.some(role => userRoles.includes(role));
        return hasRequiredRole ? ComponentIfUser : ComponentIfNoUser;
    }

    return ComponentIfUser;
};

export default ConditionalSessionRender;
