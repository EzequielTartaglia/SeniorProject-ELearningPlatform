"use client";

import { getControlCenterUserRole } from "@/src/controllers/control_center/control_center_user_role/control_center_user_role";
import { getCountry } from "@/src/controllers/control_center/control_center_country/control_center_country";

import { useState, useEffect } from "react";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import PageHeader from "@/components/page_formats/PageHeader";
import UserCard from "./UserCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { userControlCenter } = useUserControlCenterContext();

  const [userRole, setUserRole] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const role = await getControlCenterUserRole(userControlCenter.cc_user_role_id);
        setUserRole(role);
        const country = await getCountry(userControlCenter.cc_country_id);
        setUserCountry(country);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [userControlCenter.id, userControlCenter.cc_user_role_id, userControlCenter.cc_country_id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title={"Mi perfil"}
        goBackRoute={"/control_center"}
        goBackText={"Volver al inicio"}
      />

      <UserCard
        currentUser={userControlCenter}
        currentUserRole={userRole}
        currentUserCountry={userCountry}
      />

    </>
  );
}
