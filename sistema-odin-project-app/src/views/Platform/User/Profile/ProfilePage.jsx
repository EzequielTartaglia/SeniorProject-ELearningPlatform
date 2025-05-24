"use client";

import { getPlatformUserRole } from "@/src/models/platform/platform_user_role/platform_user_role";
import { getCountry } from "@/src/models/platform/country/country";
import { getStudentCourseEnrollmentsSingleUser } from "@/src/models/platform/student_course_enrollment/student_course_enrollment";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useState, useEffect } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import UserCard from "./UserCard";
import UserCoursesEnrollments from "./UserCoursesEnrollments"; // Importa el componente para mostrar los cursos
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ProfilePage() {
  const { user } = useUserInfoContext();
  const [userRole, setUserRole] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [enrollments, setEnrollments] = useState([]); // Añadir estado para los cursos
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const role = await getPlatformUserRole(user.user_role_id);
        setUserRole(role);
        const country = await getCountry(user.country_id);
        setUserCountry(country);

        const courses = await getStudentCourseEnrollmentsSingleUser(user.id);
        setEnrollments(courses);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user.country_id, user.user_role_id, user.id]);

  if (isLoading) {
    return <LoadingSpinner/>;
  }

  return (
    <>
      <PageHeader
        title={"Mi perfil"}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />

      <UserCard
        currentUser={user}
        currentUserRole={userRole}
        currentUserCountry={userCountry}
      />

      <UserCoursesEnrollments/> 
    </>
  );
}
