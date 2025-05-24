'use client';
import { createContext, useContext, useEffect } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

const UserInfoControlCenterContext = createContext();

export const useUserControlCenterContext = () => useContext(UserInfoControlCenterContext);

export const UserInfoControlCenterProvider = ({ children }) => {
  const { userControlCenter, loading, userLogoutControlCenter } = useUserControlCenterInfo();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {   
    if (!loading && !userControlCenter && pathname.startsWith('/control_center')) {
      router.push('/control_center'); 
    }
  }, [userControlCenter, loading, router, pathname]);

  return (
    <UserInfoControlCenterContext.Provider value={{ userControlCenter, userLogoutControlCenter }}>
      {children}
    </UserInfoControlCenterContext.Provider>
  );
};
