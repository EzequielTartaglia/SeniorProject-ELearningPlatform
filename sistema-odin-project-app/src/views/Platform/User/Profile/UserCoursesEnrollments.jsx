"use client";

import { getStudentCourseEnrollmentsSingleUser } from "@/src/models/platform/student_course_enrollment/student_course_enrollment";
import { getCourse } from "@/src/models/platform/course/course";

import { useEffect, useState } from "react";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import ListWithTitle from "@/components/lists/ListWithTitle";
import { FaChalkboardTeacher } from "react-icons/fa";
import { FiFileText } from "react-icons/fi";

export default function UserCoursesEnrollments() {
  const { user } = useUserInfoContext();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    async function fetchEnrollments() {
      if (user && user.id) {
        try {
          const userEnrollments = await getStudentCourseEnrollmentsSingleUser(
            parseInt(user.id, 10)
          );

          // Fetch course details for each enrollment
          const enrollmentsWithCourseNames = await Promise.all(
            userEnrollments.map(async (enrollment) => {
              const course = await getCourse(enrollment.course_id);
              return {
                ...enrollment,
                course_name: course.name,
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
  }, [user]);

  const getButtonShowRoute = (id) => `/platform/courses/${id}`;

  return (
    <>
      <ListWithTitle
        title="Cursos Inscriptos"
        items={enrollments}
        hasShow={(id) => true}
        hasEdit={false}
        hasDelete={false}
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
