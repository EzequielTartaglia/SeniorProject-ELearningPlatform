"use client";

import { getPlatformUserRole } from "@/src/controllers/platform/platform_user_role/platform_user_role";
import { getCountry } from "@/src/controllers/platform/country/country";
import { getStudentCourseEnrollmentsSingleUser } from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";
import { getPercentOfCompletionFromCourseAndUser } from "@/src/controllers/platform/student_course_module_class_progress/student_course_module_class_progress";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useState, useEffect } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import UserCard from "./UserCard";
import UserCoursesEnrollments from "./UserCoursesEnrollments";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getPlatformProfessorUser } from "@/src/controllers/platform/platform_user/platform_professor_user";
import { getCourse } from "@/src/controllers/platform/course/course";

export default function ProfilePage() {
  const { user } = useUserInfoContext();
  const [userRole, setUserRole] = useState(null);
  const [userCountry, setUserCountry] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [coursesProfessors, setCoursesProfessors] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (!user || !user.id) {
          return;
        }

        const role = await getPlatformUserRole(user.user_role_id);
        setUserRole(role);
        const country = await getCountry(user.country_id);
        setUserCountry(country);

        const courses = await getStudentCourseEnrollmentsSingleUser(user.id);
        setEnrollments(courses);

        const progressData = await Promise.all(
          courses.map(async (course) => {
            const progress = await getPercentOfCompletionFromCourseAndUser(
              course.id,
              user.id
            );
            const userProgress = parseFloat(progress);
            return { course_id: course.id, userProgress };
          })
        );
        setCoursesProgress(progressData);

        const professorData = await Promise.all(
          courses.map(async (course) => {
            try {
              const fetchedCourse = await getCourse(course.id);

              if (!fetchedCourse || !fetchedCourse.professor_id) {
                return { course_id: course.id, professor: null };
              }

              const professor = await getPlatformProfessorUser(
                fetchedCourse.professor_id
              );

              if (!professor) {
                return { course_id: course.id, professor: null };
              }

              return { course_id: course.id, professor };
            } catch (error) {
              console.error(
                `Error fetching professor for course ${course.id}:`,
                error
              );
              return { course_id: course.id, professor: null };
            }
          })
        );

        setCoursesProfessors(professorData);

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user.country_id, user.user_role_id, user.id, user]);

  if (isLoading) {
    return <LoadingSpinner />;
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

      <UserCoursesEnrollments
        coursesProgresses={coursesProgress}
        coursesProfessors={coursesProfessors}
      />
    </>
  );
}
