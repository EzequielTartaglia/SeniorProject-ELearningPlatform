"use client";

import {
  getStudentCourseEnrollments,
  deleteStudentCourseEnrollment,
  editStudentCourseEnrollmentStatus,
} from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";
import { getPlatformUser } from "@/src/controllers/platform/platform_user/platform_user";
import { getCourse } from "@/src/controllers/platform/course/course";
import { getPlatformState } from "@/src/controllers/platform/platform_state/platform_state";
import { addStudentCourseEnrollmentFinalExamAttempt } from "@/src/controllers/platform/student_course_enrollment_final_exam_attempt/student_course_enrollment_final_exam_attempt";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import formatDate from "@/src/helpers/formatDate";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import SearchInput from "@/components/SearchInput";
import CurrencyTypesFilter from "@/components/filters/admin_course_enrollments_filters/CurrencyTypesFilter";
import CourseEnrollmentStatusFilter from "@/components/filters/admin_course_enrollments_filters/CourseEnrollmentStatusFilter";

export default function AdminCourseEnrollmentsPage() {
  const [coursesEnrollmentsStates, setCoursesEnrollmentsStates] = useState([]);
  const [filter, setFilter] = useState("all");
  const [currencyFilter, setCurrencyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCoursesEnrollmentStates = async () => {
      try {
        const courseEnrollments = await getStudentCourseEnrollments();

        const userPromises = courseEnrollments.map((enrollment) =>
          enrollment.platform_user_id
            ? getPlatformUser(enrollment.platform_user_id)
            : Promise.resolve(null)
        );
        const coursePromises = courseEnrollments.map((enrollment) =>
          enrollment.course_id
            ? getCourse(enrollment.course_id)
            : Promise.resolve(null)
        );
        const statePromises = courseEnrollments.map((enrollment) =>
          enrollment.platform_state_id
            ? getPlatformState(enrollment.platform_state_id)
            : Promise.resolve(null)
        );

        const [users, courses, states] = await Promise.all([
          Promise.all(userPromises),
          Promise.all(coursePromises),
          Promise.all(statePromises),
        ]);

        const enrollmentsWithUsersAndCourses = courseEnrollments.map(
          (enrollment, index) => ({
            ...enrollment,
            user: users[index],
            course: courses[index],
            state: states[index],
          })
        );

        setCoursesEnrollmentsStates(enrollmentsWithUsersAndCourses);
      } catch (error) {
        console.error("Error fetching course enrollments:", error.message);
      }
    };

    fetchCoursesEnrollmentStates();
  }, []);

  const handleDeleteCourseEnrollmentState = async (id) => {
    try {
      await deleteStudentCourseEnrollment(id);
      showNotification("Inscripción eliminada exitosamente!", "info");
      setCoursesEnrollmentsStates((prev) =>
        prev.filter((enrollment) => enrollment.id !== id)
      );
    } catch (error) {
      console.error("Error deleting enrollment:", error.message);
    }
  };

  const handleApproveCourseEnrollmentState = async (id) => {
    try {
      const enrollment = coursesEnrollmentsStates.find(
        (enrollment) => enrollment.id === id
      );
      if (!enrollment) throw new Error("Enrollment not found");

      const course = await getCourse(enrollment.course_id);
      if (course.has_final_exam) {
        await addStudentCourseEnrollmentFinalExamAttempt(0, 0, 0, id, false);
      }

      await editStudentCourseEnrollmentStatus(id, 3);
      setCoursesEnrollmentsStates((prev) =>
        prev.map((enrollment) =>
          enrollment.id === id
            ? { ...enrollment, platform_state_id: 3, state: { name: "Pagado" } }
            : enrollment
        )
      );

      showNotification("Inscripción aprobada exitosamente!", "success");
    } catch (error) {
      console.error("Error approving enrollment:", error.message);
    }
  };

  const columns = [
    "enrollment_date",
    "full_name",
    "email",
    "name",
    "currency_abbreviation",
    "price",
    "platform_state_id",
  ];
  const columnAliases = {
    enrollment_date: "Fecha de inscripción",
    full_name: "Nombre Completo",
    email: "Correo Electrónico",
    name: "Curso",
    platform_state_id: "Estado",
    currency_abbreviation: "Moneda",
    price: "Monto",
  };

  const filteredData = coursesEnrollmentsStates
    .filter((enrollment) => {
      const searchTermLower = searchTerm.toLowerCase();
      return (
        (!searchTerm ||
          enrollment.user.first_name.toLowerCase().includes(searchTermLower) ||
          enrollment.user.last_name.toLowerCase().includes(searchTermLower) ||
          enrollment.user.email.toLowerCase().includes(searchTermLower) ||
          enrollment.course.name.toLowerCase().includes(searchTermLower)) &&
        (statusFilter === "all" ||
          (statusFilter === "pending" && enrollment.platform_state_id !== 3) ||
          (statusFilter === "paid" && enrollment.platform_state_id === 3)) &&
        (currencyFilter === "all" ||
          enrollment.currency_abbreviation === currencyFilter)
      );
    })
    .map((enrollment) => ({
      id: enrollment.id,
      enrollment_date: formatDate(enrollment.enrollment_date),
      full_name: `${enrollment.user.first_name} ${enrollment.user.last_name}`,
      email: enrollment.user.email,
      name: enrollment.course.name,
      currency_abbreviation: enrollment.currency_abbreviation,
      price: enrollment.course.is_paid
        ? `$ ${enrollment.payment.toFixed(2)}`
        : "Gratuito",
      platform_state_id: enrollment.state.name,
      hasApprove: enrollment.platform_state_id === 2,
    }));

  const uniqueCurrencies = [
    ...new Set(
      coursesEnrollmentsStates.map((item) => item.currency_abbreviation)
    ),
  ];

  const handleFilterChange = setFilter;
  const handleCurrencyChange = setCurrencyFilter;
  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleStatusChange = setStatusFilter;

  const hasApprove = (item) => {
    return;
  };

  return (
    <>
      <PageHeader
        title={"Inscripciones"}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />

      <div className="p-4 box-theme shadow rounded-lg mb-4 w-full">
        <div className="flex justify-center mb-4">
          <SearchInput
            placeholder="Buscar correo electronico o curso..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mt-4">
          <div className="flex-1 lg:mr-4">
            <CurrencyTypesFilter
              currencyFilter={currencyFilter}
              uniqueCurrencies={uniqueCurrencies}
              onCurrencyChange={handleCurrencyChange}
            />
          </div>

          <div className="flex-1 lg:ml-4 lg:text-left">
            <CourseEnrollmentStatusFilter
              statusFilter={statusFilter}
              onStatusChange={handleStatusChange}
            />
          </div>
        </div>
      </div>

      <Table
        title={"Estados de inscripción registrados"}
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={() => false}
        hasEdit={() => false}
        hasDelete={true}
        hasApprove={(enrollment) => enrollment.hasApprove}
        buttonDeleteRoute={handleDeleteCourseEnrollmentState}
        buttonApproveRoute={handleApproveCourseEnrollmentState}
        confirmModalText={
          "¿Estás seguro de que deseas eliminar esta inscripción?"
        }
      />
    </>
  );
}
