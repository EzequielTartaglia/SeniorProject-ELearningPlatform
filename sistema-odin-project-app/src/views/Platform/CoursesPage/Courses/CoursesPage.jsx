"use client";

import {
  deleteCourse,
  getCourse,
  getCourses,
} from "@/src/controllers/platform/course/course";
import {
  addStudentCourseEnrollment,
  getStudentCourseEnrollmentsSingleUser,
} from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";
import { getPercentOfCompletionFromCourseAndUser } from "@/src/controllers/platform/student_course_module_class_progress/student_course_module_class_progress";

import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useMemo, useState } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import { FiDollarSign, FiClock, FiFileText } from "react-icons/fi";
import PaymentLinkModal from "./PaymentLinkModal";
import ConfirmEnrollmentModal from "./ConfirmEnrollmentModal";
import formatDate from "@/src/helpers/formatDate";
import { FaChalkboardTeacher } from "react-icons/fa";
import SearchInput from "@/components/SearchInput";
import CoursesListWithTitle from "@/components/lists/CoursesListWithTitle";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getPlatformProfessorUser } from "@/src/controllers/platform/platform_user/platform_professor_user";

export default function CoursesPage() {
  const { user } = useUserInfoContext();

  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [coursesProgress, setCoursesProgress] = useState([]);
  const [coursesProfessors, setCoursesProfessors] = useState([]);

  const [enrollments, setEnrollments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("all"); // 'all', 'pending', 'paid', 'not_enrolled'

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [paymentMethods, setPaymentMethods] = useState([]);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [selectedPaymentLink, setSelectedPaymentLink] = useState("");
  const [selectedPaymentMethodCurrency, setSelectedPaymentMethodCurrency] =
    useState("");

  const { showNotification } = useNotification();

  const isEnrolled = (id) => {
    return enrollments.some((enrollment) => enrollment.course_id === id);
  };

  const isPending = (id) => {
    const enrollment = enrollments.find(
      (enrollment) => enrollment.course_id === id
    );
    return enrollment && enrollment.platform_state_id === 2;
  };

  const isPaid = (id) => {
    const enrollment = enrollments.find(
      (enrollment) => enrollment.course_id === id
    );
    return enrollment && enrollment.platform_state_id === 3;
  };

  useEffect(() => {
    const fetchData = async () => {
      if (user && user.id) {
        try {
          const [coursesFetched, userEnrollments] = await Promise.all([
            getCourses(),
            getStudentCourseEnrollmentsSingleUser(parseInt(user.id, 10)),
          ]);
          setCourses(coursesFetched);
          setEnrollments(userEnrollments);

          const progressData = await Promise.all(
            coursesFetched.map(async (course) => {
              const progress = await getPercentOfCompletionFromCourseAndUser(
                course.id,
                user.id
              );
              return {
                course_id: course.id,
                userProgress: parseFloat(progress),
              };
            })
          );
          setCoursesProgress(progressData);

          const professorData = await Promise.all(
            coursesFetched.map(async (course) => {
              try {
                const professor = await getPlatformProfessorUser(
                  course.professor_id
                );
                return { course_id: course.id, professor };
              } catch {
                return { course_id: course.id, professor: null };
              }
            })
          );
          setCoursesProfessors(professorData);
        } catch (error) {
          console.error("Error al obtener los datos:", error.message);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchData();
  }, [user]);

  const filteredCoursesMemo = useMemo(() => {
    return courses.filter((course) => {
      const isCourseFiltered =
        selectedFilter === "all" ||
        (selectedFilter === "pending" && isPending(course.id)) ||
        (selectedFilter === "paid" && isPaid(course.id)) ||
        (selectedFilter === "not_enrolled" && !isEnrolled(course.id));

      return (
        isCourseFiltered &&
        course.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [courses, selectedFilter, searchTerm, enrollments]);

  useEffect(() => {
    setFilteredCourses(filteredCoursesMemo);
  }, [filteredCoursesMemo]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteCourse = async (id) => {
    try {
      await deleteCourse(id);
      setCourses(courses.filter((course) => course.id !== id));
      showNotification("¡Curso eliminado exitosamente!", "info");
    } catch (error) {
      console.error("Error al eliminar el curso:", error.message);
    }
  };

  const hasPreview = (id) => {
    return true; 
  };

  const handleCourseEnrollment = async (id) => {
    if (!isEnrolled(id)) {
      try {
        const course_details = await getCourse(id);
        if (course_details) {
          if (course_details.is_paid) {
            setSelectedCourse(course_details);
            setPaymentMethods(course_details.payment_methods);
            setIsConfirmModalOpen(true);
          } else {
            await addStudentCourseEnrollment(
              user.id,
              course_details.id,
              3,
              0,
              formatDate(new Date(), "yyyy-MM-dd"),
              "No aplica"
            );

            showNotification("¡Inscripción realizada exitosamente!", "success");

            const userEnrollments = await getStudentCourseEnrollmentsSingleUser(
              parseInt(user.id, 10)
            );
            setEnrollments(userEnrollments);
          }
        } else {
          console.error("El curso no tiene detalles válidos");
        }
      } catch (error) {
        console.error(
          "Error al obtener los detalles del curso:",
          error.message
        );
      }
    }
  };

  const handleConfirmEnrollment = async () => {
    if (
      selectedCourse &&
      selectedPaymentMethod &&
      selectedPaymentMethodCurrency
    ) {
      try {
        await addStudentCourseEnrollment(
          user.id,
          selectedCourse.id,
          2,
          selectedPaymentMethod.price,
          new Date().toISOString().split("T")[0],
          selectedPaymentMethodCurrency
        );

        const userEnrollments = await getStudentCourseEnrollmentsSingleUser(
          parseInt(user.id, 10)
        );
        setEnrollments(userEnrollments);

        setIsConfirmModalOpen(false);
        setPaymentLink(selectedPaymentLink);
        setIsPaymentModalOpen(true);
      } catch (error) {
        console.error("Error al inscribirse en el curso:", error.message);
      }
    }
  };

  const handleCoursePendingEnrollmentStatus = (id) => {
    if (!isEnrolled(id)) {
      // logic to pending course enrollment
    }
  };

  const shouldPendingButton = (id) => {
    return isEnrolled(id) && isPending(id);
  };

  const shouldShowButton = (id) => {
    return isEnrolled(id) && isPaid(id);
  };

  const getButtonAddRoute = () => {
    return user.user_role_id === 3 || user.user_role_id === 4
      ? `/platform/courses/new`
      : "";
  };

  const getButtonShowRoute = (id) => {
    return shouldShowButton(id) ? `/platform/courses/${id}` : "";
  };

  const getButtonEditRoute = (id) => {
    return user.user_role_id === 3 || user.user_role_id === 4
      ? `/platform/courses/${id}/edit`
      : "";
  };

  const hasEdit = (id) => {
    if (user.user_role_id === 3) {
      const course = courses.find((course) => course.id === id);
      if (course.platform_user_business_id === user.platform_user_business_id) {
        return true;
      } else {
        return false;
      }
    } else if (
      user.user_role_id === 3 ||
      user.user_role_id === 4 ||
      user.user_role_id === 5
    ) {
      return true;
    } else {
      return false;
    }
  };

  const hasDelete = (id) => {
    if (user.user_role_id === 3) {
      const course = courses.find((course) => course.id === id);
      if (course.platform_user_business_id === user.platform_user_business_id) {
        return true;
      } else {
        return false;
      }
    } else if (
      user.user_role_id === 3 ||
      user.user_role_id === 4 ||
      user.user_role_id === 5
    ) {
      return true;
    } else {
      return false;
    }
  };

  const getButtonPreviewRoute = (id) => {
    return hasPreview(id) ? `/platform/courses/${id}/preview` : "";
  };

  return (
    <>
      {isLoading ? (
        <>
          <LoadingSpinner />
        </>
      ) : (
        <>
          {" "}
          <PageHeader
            title="Cursos"
            goBackRoute={`/platform/`}
            goBackText="Volver al inicio"
          />
          <SearchInput
            placeholder="Buscar cursos..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <CoursesListWithTitle
            customRender={
              <div className="flex space-x-3 mb-4 flex-wrap">
                <button
                  title="Todos"
                  className={`px-2 py-1 font-semibold ${
                    selectedFilter === "all"
                      ? "border-b-2 text-title-active-static"
                      : ""
                  }`}
                  style={{
                    borderColor: selectedFilter === "all" ? "#1070ca" : "",
                  }}
                  onClick={() => setSelectedFilter("all")}
                >
                  <span className="sm:hidden">Todos</span>
                  <span className="hidden sm:inline">Todos</span>
                </button>
                <button
                  title="Pendiente de aprobacion de matricula"
                  className={`px-2 py-1 font-semibold ${
                    selectedFilter === "pending"
                      ? "border-b-2 text-title-active-static"
                      : ""
                  }`}
                  style={{
                    borderColor: selectedFilter === "pending" ? "#1070ca" : "",
                  }}
                  onClick={() => setSelectedFilter("pending")}
                >
                  <span className="sm:hidden">Matr.</span>
                  <span className="hidden sm:inline">Matriculando</span>
                </button>
                <button
                  title="Inscriptos"
                  className={`px-2 py-1 font-semibold ${
                    selectedFilter === "paid"
                      ? "border-b-2 text-title-active-static"
                      : ""
                  }`}
                  style={{
                    borderColor: selectedFilter === "paid" ? "#1070ca" : "",
                  }}
                  onClick={() => setSelectedFilter("paid")}
                >
                  <span className="sm:hidden">Inscr.</span>
                  <span className="hidden sm:inline">Inscriptos</span>
                </button>
                <button
                  title="No inscriptos"
                  className={`px-2 py-1 font-semibold ${
                    selectedFilter === "not_enrolled"
                      ? "border-b-2 text-title-active-static"
                      : ""
                  }`}
                  style={{
                    borderColor:
                      selectedFilter === "not_enrolled" ? "#1070ca" : "",
                  }}
                  onClick={() => setSelectedFilter("not_enrolled")}
                >
                  <span className="sm:hidden">No inscr.</span>
                  <span className="hidden sm:inline">No inscriptos</span>
                </button>
              </div>
            }
            items={filteredCourses.map((course) => {
              const professor = coursesProfessors.find(
                (professorData) => professorData.course_id === course.id
              )?.professor;
              return {
                ...course,
                progress: coursesProgress.find(
                  (progress) =>
                    progress.course_id === course.id &&
                    progress.userProgress > 0
                )?.userProgress,
                professor,
              };
            })}
            hasAdd={
              user.user_role_id === 3 ||
              user.user_role_id === 4 ||
              user.user_role_id === 5
            }
            buttonAddRoute={getButtonAddRoute()}
            hasShow={(id) => shouldShowButton(id)}
            hasShowIcon={
              <FaChalkboardTeacher className="text-show-link" size={24} />
            }
            buttonShowRoute={(id) => getButtonShowRoute(id)}
            hasEdit={hasEdit}
            buttonEditRoute={(id) => getButtonEditRoute(id)}
            hasDelete={hasDelete}
            buttonDeleteRoute={handleDeleteCourse}
            columnName="name"
            confirmModalText="¿Estás seguro de que deseas eliminar este curso?"
            hasExtraButton3={(id) => hasPreview(id)}
            extraButtonTitle3={"Ver información adicional del curso"}
            extraButtonIcon3={<FiFileText size={24} className="text-title" />}
            buttonEditRoute3={(id) => getButtonPreviewRoute(id)}
            hasExtraButton={(id) => !isEnrolled(id)}
            extraButtonTitle={(id) =>
              isEnrolled(id) ? "Inscrito" : "Matricular"
            }
            extraButtonIcon={
              <FiDollarSign
                className="text-yellow-500 hover:text-yellow-400"
                size={24}
              />
            }
            onExtraButtonClick={handleCourseEnrollment}
            hasExtraButton2={(id) => isPending(id)}
            extraButtonTitle2={(id) =>
              isPending(id) && "Pendiente de aprobación"
            }
            extraButtonIcon2={
              <FiClock className="disabled text-gray-400 cursor-not-allowed" />
            }
            onExtraButtonClick2={handleCoursePendingEnrollmentStatus}
          />
          <ConfirmEnrollmentModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={handleConfirmEnrollment}
            paymentMethods={paymentMethods}
            setSelectedPaymentMethod={setSelectedPaymentMethod}
            setSelectedPaymentLink={setSelectedPaymentLink}
            setSelectedPaymentMethodCurrency={setSelectedPaymentMethodCurrency}
            message={`${selectedCourse?.name}`}
          />
          <PaymentLinkModal
            isOpen={isPaymentModalOpen}
            onClose={() => setIsPaymentModalOpen(false)}
            paymentLink={paymentLink}
          />
        </>
      )}
    </>
  );
}
