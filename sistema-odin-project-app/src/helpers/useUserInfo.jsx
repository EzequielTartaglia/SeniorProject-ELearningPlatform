'use client';
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { getPlatformUser } from "../models/platform/platform_user/platform_user";
import { LogoutUserPlatform } from "../models/platform/platform_user/logout";

export const useUserInfo = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const userLogout = useCallback(async () => {
    try {
      await axios.get('/api/auth/logout');
      await LogoutUserPlatform(user?.id); 
      setUser(null); 
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const { data: currentUserToken } = await axios.get('/api/auth/login/get_cookie');

        if (currentUserToken) {
          const currentUser = await getPlatformUser(currentUserToken.id);

          if (currentUser) {
            // Verificar si el usuario está bloqueado o baneado
            if (currentUser.is_banned || currentUser.is_blocked) {
              await userLogout();  
              return; 
            }
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Error fetching user information:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [userLogout]);

  return { user, loading, userLogout };
};
