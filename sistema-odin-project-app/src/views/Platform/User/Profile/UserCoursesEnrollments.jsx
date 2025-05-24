"use client";

import { getStudentCourseEnrollmentsPaidSingleUser } from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";
import { getCourse } from "@/src/controllers/platform/course/course";

import { useEffect, useState } from "react";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";
import CoursesListWithTitleProfile from "@/components/lists/CoursesListWithTitleProfile";

export default function UserCoursesEnrollments({ coursesProgresses, coursesProfessors }) {
  const { user } = useUserInfoContext();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    async function fetchEnrollments() {
      if (user && user.id) {
        try {
          const userEnrollments = await getStudentCourseEnrollmentsPaidSingleUser(
            parseInt(user.id)
          );

          // Fetch course details for each enrollment
          const enrollmentsWithCourseNames = await Promise.all(
            userEnrollments.map(async (enrollment) => {
              const course = await getCourse(enrollment.course_id);

              const professor = coursesProfessors.find(
                (professorData) => professorData.course_id === course.id
              )?.professor;

              // Find the progress for the current course
              const progress = coursesProgresses.find(
                (progress) => progress.course_id === enrollment.course_id
              );

              return {
                ...enrollment,
                course_name: course.name,
                progress: progress ? progress.userProgress : 0,
                professor,
              };
            })
          );

          setEnrollments(enrollmentsWithCourseNames);
        } catch (error) {
          console.error(
            "Error al obtener las inscripciones del usuario:",
            error.message
          );
        }
      }
    }

    fetchEnrollments();
  }, [user, coursesProgresses, coursesProfessors]);

  const getButtonShowRoute = (id) => `/platform/courses/${id}`;

  return (
    <>
      <CoursesListWithTitleProfile
        title="Cursos Inscriptos"
        items={enrollments.map((course) => {
          const professor = coursesProfessors.find(
            (professorData) => professorData.course_id === course.id
          )?.professor;
          return {
            ...course,
            progress: coursesProgresses.find(
              (progress) =>
                progress.course_id === course.id &&
                progress.userProgress > 0
            )?.userProgress,
            professor,
          };
        })}
        hasShow={(id) => true}
        hasEdit={(id) => false}
        hasDelete={(id) => false}
        buttonShowRoute={(id) => getButtonShowRoute(id)}
        columnName="course_name"
        hasShowIcon={
          <FaChalkboardTeacher className="text-show-link" size={24} />
        }
        extraButtonIcon={<FiFileText size={24} className="text-title" />}
        extraButtonTitle="Ver información adicional del curso"
      />
    </>
  );
}
