'use client';
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { getControlCenterUser } from "../controllers/control_center/control_center_user/control_center_user";
import { LogoutControlCenterUser } from "../controllers/control_center/control_center_user/logout";

export const useUserControlCenterInfo = () => {
  const [userControlCenter, setUserControlCenterUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userLogoutControlCenter = useCallback(async () => {
    try {
      await axios.get('/api/auth/logout_control_center');
      await LogoutControlCenterUser(userControlCenter?.id); 
      setUserControlCenterUser(null); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [userControlCenter?.id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: currentUserToken } = await axios.get('/api/auth/login_control_center/get_cookie');

        if (currentUserToken) {
          const currentUser = await getControlCenterUser(currentUserToken.id);

          if (currentUser) {
            // Verificar si el usuario está bloqueado o baneado
            if (currentUser.is_banned || currentUser.is_blocked) {
              await userLogoutControlCenter();  
              return; 
            }
            setUserControlCenterUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userLogoutControlCenter]);

  return { userControlCenter, loading, userLogoutControlCenter };
};
