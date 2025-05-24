"use client";

import { useEffect, useState } from "react";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getControlCenterUserBusinessEnabledPluggins } from "../controllers/control_center/control_center_user_business/control_center_user_business";

const ConditionalSessionControlCenterRender = ({ 
    ComponentIfUser, 
    ComponentIfNoUser, 
    AuthorizedUserRoles, 
    enablePluginsRequireds = []
}) => {
    const { userControlCenter } = useUserControlCenterContext();
    const [enabledPlugins, setEnabledPlugins] = useState([]); 
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchEnabledPlugins = async () => {
            if (!userControlCenter) {
                setIsLoading(false);
                return;
            }

            try {
                if (userControlCenter.cc_user_business_id !== 1) {
                    const plugins = await getControlCenterUserBusinessEnabledPluggins(userControlCenter.cc_user_business_id);
                    
                    
                    const parsedEnabledPlugins = 
                        typeof plugins === "string" 
                            ? JSON.parse(plugins) 
                            : plugins;
                    
                    const selectedPluginIds = 
                        Array.isArray(parsedEnabledPlugins) 
                            ? parsedEnabledPlugins.map(plugin => plugin.id || plugin) 
                            : [];

                    setEnabledPlugins(selectedPluginIds);
                } else {
                    setEnabledPlugins([]);
                }
            } catch (error) {
                console.error("Error al obtener plugins:", error);
                setEnabledPlugins([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEnabledPlugins();
    }, [userControlCenter]);

    if (!userControlCenter) {
        return ComponentIfNoUser;
    }

    if (isLoading) {
        return <LoadingSpinner/>; 
    }

    const userRoles = Array.isArray(userControlCenter.cc_user_role_id) 
        ? userControlCenter.cc_user_role_id 
        : [userControlCenter.cc_user_role_id];

    const hasRequiredRole = AuthorizedUserRoles?.length > 0 
        ? AuthorizedUserRoles.some(role => userRoles.includes(role)) 
        : true;

    if (userControlCenter.cc_user_business_id === 1) {
        return hasRequiredRole ? ComponentIfUser : ComponentIfNoUser;
    }

    const hasRequiredPlugins = enablePluginsRequireds.every(pluginId => 
        enabledPlugins.includes(Number(pluginId)) 
    );


    return hasRequiredRole && hasRequiredPlugins ? ComponentIfUser : ComponentIfNoUser;
};

export default ConditionalSessionControlCenterRender;
