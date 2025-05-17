"use client";

import {
  getCourseModulesAndClasses,
  getCourseWithLevel,
  getTotalTimeToComplete,
} from "@/src/controllers/platform/course/course";
import { deleteCourseModuleClass } from "@/src/controllers/platform/course_module_class/course_module_class";
import { deleteCourseModule } from "@/src/controllers/platform/course_module/courses_module";
import { getCourseFinalExam } from "@/src/controllers/platform/course_final_exam/course_final_exam";
import {
  checkStudentCourseEnrollment,
  getStudentCourseEnrollmentsSingleUserAndCourse,
} from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";
import {
  addStudentCourseEnrollmentFinalExamAttempt,
  checkStudentCourseEnrollmentFinalExamAttempt,
} from "@/src/controllers/platform/student_course_enrollment_final_exam_attempt/student_course_enrollment_final_exam_attempt";
import {
  addStudentCourseModuleClassProgress,
  deleteStudentCourseModuleClassProgress,
  getExistingProgressFromUserEnrollmentAndClass,
  getStudentProgressIds,
  getPercentOfCompletionFromCourseAndUser,
} from "@/src/controllers/platform/student_course_module_class_progress/student_course_module_class_progress";
import { getPlatformProfessorUser } from "@/src/controllers/platform/platform_user/platform_professor_user";

import { useCallback, useEffect, useState } from "react";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useNotification } from "@/contexts/NotificationContext";
import formatTimeFromMinutesToHoursAndMinutes from "@/src/helpers/formatTimeFromMinutesToHoursAndMinutes";

import ModuleDropdownList from "./Module/CourseModuleDropdownList";
import { FiEdit, FiSettings } from "react-icons/fi";
import LiWithTitle from "@/components/lists/LiWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";
import CourseDetailsCard from "./CourseDetailsCard";
import { FaEdit, FaFileDownload, FaGraduationCap } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";

export default function CourseDetailsPage({ courseId }) {
  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();

  const [courseDetails, setCourseDetails] = useState(null);
  const [modulesWithClasses, setModulesWithClasses] = useState([]);
  const [professor, setProfessor] = useState(null);

  const [courseFinalExamDetails, setCourseFinalExamDetails] = useState(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const [arrayOfClassesCompleted, setArrayOfClassesCompleted] = useState([]);
  const [totalProgressCompletion, setTotalProgressCompletion] = useState(null);

  const fetchData = useCallback(async () => {
    if (!courseId || !user?.id) return;

    try {
      const details = await getCourseWithLevel(courseId);
      setCourseDetails(details);

      if (details.professor_id) {
        const professorDetails = await getPlatformProfessorUser(
          details.professor_id
        );
        setProfessor(professorDetails || null);
      } else {
        setProfessor(null);
      }

      const timeToComplete = await getTotalTimeToComplete(courseId);
      setTotalTime(timeToComplete);

      const finalExamDetails = await getCourseFinalExam(courseId);
      setCourseFinalExamDetails(finalExamDetails);

      const modulesClasses = await getCourseModulesAndClasses(courseId);

      const modulesWithCompletedClasses = modulesClasses.map((module) => {
        const updatedClasses = module.moduleClasses.map((moduleClass) => ({
          ...moduleClass,
          isCompleted: arrayOfClassesCompleted.includes(moduleClass.id),
        }));

        return { ...module, moduleClasses: updatedClasses };
      });

      setModulesWithClasses(modulesWithCompletedClasses);

      const enrollment = await checkStudentCourseEnrollment(user?.id, courseId);
      setEnrollmentDetails(enrollment);

      if (enrollment && details.has_final_exam) {
        const enrollmentId = enrollment.id;
        const hasAttempt = await checkStudentCourseEnrollmentFinalExamAttempt(
          enrollmentId
        );
        if (!hasAttempt) {
          await addStudentCourseEnrollmentFinalExamAttempt(
            0,
            0,
            0,
            enrollmentId,
            false
          );
        }

        setIsApproved(hasAttempt ? hasAttempt.is_approved : false);
      }

      const progressIds = await getStudentProgressIds(user?.id);
      setArrayOfClassesCompleted(
        progressIds.map((progress) => progress.course_module_class_id)
      );

      const progressCompletion = await getPercentOfCompletionFromCourseAndUser(
        courseId,
        user?.id
      );
      setTotalProgressCompletion(progressCompletion);
    } catch (error) {
      console.error("Error fetching course details:", error.message);
    } finally {
      setLoading(false);
    }
  }, [courseId, user?.id, arrayOfClassesCompleted]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleCompleteCourseModuleClass = async (id) => {
    try {
      const enrollment = await getStudentCourseEnrollmentsSingleUserAndCourse(
        user?.id,
        courseId
      );

      if (!enrollment) {
        throw new Error(
          "No se encontró la matrícula del estudiante para este curso."
        );
      }

      await addStudentCourseModuleClassProgress(
        enrollment.id,
        id,
        user?.id,
        true
      );
    } catch (error) {
      console.error("Error trying to complete class:", error.message);
    }
  };

  const handleIncompleteCourseModuleClass = async (id) => {
    try {
      const enrollment = await getStudentCourseEnrollmentsSingleUserAndCourse(
        user?.id,
        courseId
      );

      if (!enrollment) {
        throw new Error(
          "No se encontró la matrícula del estudiante para este curso."
        );
      }

      const userProgressFetched =
        await getExistingProgressFromUserEnrollmentAndClass(
          user?.id,
          enrollment?.id,
          id
        );

      await deleteStudentCourseModuleClassProgress(userProgressFetched.id);
    } catch (error) {
      console.error("Error trying to complete class:", error.message);
    }
  };

  const handleDeleteCourseModuleClass = async (id) => {
    try {
      await deleteCourseModuleClass(id);
      showNotification("¡Clase eliminada exitosamente!", "info");

      setModulesWithClasses((prevModules) =>
        prevModules.map((module) => ({
          ...module,
          moduleClasses: module.moduleClasses.filter((cls) => cls.id !== id),
        }))
      );
    } catch (error) {
      console.error("Error deleting class:", error.message);
    }
  };

  const handleDeleteCourseModule = async (moduleId) => {
    try {
      await deleteCourseModule(moduleId);
      showNotification("¡Modulo eliminado exitosamente!", "info");

      setModulesWithClasses((prevModules) =>
        prevModules.filter((module) => module.module.id !== moduleId)
      );
    } catch (error) {
      console.error("Error deleting module:", error.message);
    }
  };

  const formattedTime = formatTimeFromMinutesToHoursAndMinutes(totalTime);

  const user_fullname = `${user?.first_name} ${user?.last_name}`;
  const user_dni_ssn = user?.dni_ssn;
  const course_hours_to_complete =
    totalTime > 0
      ? `${formattedTime.hours + (formattedTime.minutes >= 30 ? 0.5 : 0)} horas`
      : 0;

  const downloadCertificate = (
    name,
    courseName,
    courseDuration,
    userDniSsn
  ) => {
    const url = `/api/certificates/course_completion_certificate?name=${encodeURIComponent(
      name
    )}&userDniSsn=${encodeURIComponent(
      userDniSsn
    )}&courseName=${encodeURIComponent(
      courseName
    )}&courseDuration=${encodeURIComponent(courseDuration)}`;
    window.open(url, "_blank");
  };

  if (loading) return <LoadingSpinner />;
  if (!enrollmentDetails && showMessage)
    return <div className="text-primary">No estás inscrito a este curso.</div>;

  return (
    <>
      {courseDetails && enrollmentDetails ? (
        <>
          <PageHeader
            title={courseDetails.name || "Cargando..."}
            goBackRoute={`/platform/courses/`}
            goBackText="Volver al listado de cursos"
          />

          {user &&
            ((user.user_role_id === 3 &&
              user.platform_user_business_id ===
                courseDetails.platform_user_business_id) ||
              user.user_role_id === 4 ||
              user.user_role_id === 5) && (
              <div
                className="flex flex-col items-center md:items-end w-full 
                              sm:min-w-[700px] sm:max-w-[700px]   
                              md:min-w-[800px] md:max-w-[800px] 
                              lg:min-w-[860px] lg:max-w-[1280px] 
                              xl:min-w-[1280px] xl:max-w-[1536px]"
              >
                <Button
                  route={`/platform/courses/${courseId}/edit`}
                  customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                  text={"Editar curso"}
                  icon={<FiEdit size={24} />}
                  title={"Editar curso"}
                />
              </div>
            )}

          {courseDetails.description && (
            <CourseDetailsCard
              imageUrl={courseDetails.image_preview_link}
              description={courseDetails.description}
              totalTime={
                totalTime > 0
                  ? `${formattedTime.hours} horas ${formattedTime.minutes} minutos`
                  : ""
              }
              level={courseDetails.course_levels.name}
              {...(professor && { professor })}
            />
          )}

          <ModuleDropdownList
            title="Módulos"
            hasAddModule={
              user &&
              ((user.user_role_id === 3 &&
                user.platform_user_business_id ===
                  courseDetails.platform_user_business_id) ||
                user.user_role_id === 4 ||
                user.user_role_id === 5)
            }
            buttonAddModule={
              user &&
              ((user.user_role_id === 3 &&
                user.platform_user_business_id ===
                  courseDetails.platform_user_business_id) ||
                user.user_role_id === 4 ||
                user.user_role_id === 5)
                ? `/platform/courses/${courseId}/modules/new`
                : "/platform"
            }
            modulesWithClasses={modulesWithClasses}
            hasAddClass={
              user &&
              ((user.user_role_id === 3 &&
                user.platform_user_business_id ===
                  courseDetails.platform_user_business_id) ||
                user.user_role_id === 4 ||
                user.user_role_id === 5)
            }
            buttonShowRoute={(moduleId, classId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/${classId}`
            }
            hasCompleteClass={user}
            buttonCompleteRoute={handleCompleteCourseModuleClass}
            buttonIncompleteRoute={handleIncompleteCourseModuleClass}
            hasEditModule={
              user &&
              ((user.user_role_id === 3 &&
                user.platform_user_business_id ===
                  courseDetails.platform_user_business_id) ||
                user.user_role_id === 4 ||
                user.user_role_id === 5)
            }
            buttonEditRouteModule={(moduleId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/edit`
            }
            hasDeleteModule={
              user &&
              ((user.user_role_id === 3 &&
                user.platform_user_business_id ===
                  courseDetails.platform_user_business_id) ||
                user.user_role_id === 4 ||
                user.user_role_id === 5)
            }
            buttonDeleteModuleRoute={handleDeleteCourseModule}
            buttonAddRouteModuleClass={(moduleId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/new`
            }
            hasEditClass={
              user &&
              ((user.user_role_id === 3 &&
                user.platform_user_business_id ===
                  courseDetails.platform_user_business_id) ||
                user.user_role_id === 4 ||
                user.user_role_id === 5)
            }
            buttonEditRoute={(moduleId, classId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/${classId}/edit`
            }
            hasDeleteClass={
              user &&
              ((user.user_role_id === 3 &&
                user.platform_user_business_id ===
                  courseDetails.platform_user_business_id) ||
                user.user_role_id === 4 ||
                user.user_role_id === 5)
            }
            buttonDeleteRoute={handleDeleteCourseModuleClass}
            columnName="title"
            completedClassIds={arrayOfClassesCompleted}
          />

          {modulesWithClasses.length > 0 && courseDetails.has_final_exam && (
            <>
              <LiWithTitle
                title="Examen Final"
                buttonTitle="Editar"
                hasIconRight={
                  user &&
                  ((user.user_role_id === 3 &&
                    user.platform_user_business_id ===
                      courseDetails.platform_user_business_id) ||
                    user.user_role_id === 4 ||
                    user.user_role_id === 5)
                }
                items={[courseFinalExamDetails?.title]}
                buttonRouteTitle={
                  user &&
                  ((user.user_role_id === 3 &&
                    user.platform_user_business_id ===
                      courseDetails.platform_user_business_id) ||
                    user.user_role_id === 4 ||
                    user.user_role_id === 5)
                    ? `/platform/courses/${courseId}/final_exam/manage`
                    : "/platform"
                }
                buttonRoute={
                  user &&
                  ((user.user_role_id === 3 &&
                    user.platform_user_business_id ===
                      courseDetails.platform_user_business_id) ||
                    user.user_role_id === 4 ||
                    user.user_role_id === 5)
                    ? `/platform/courses/${courseId}/final_exam/${courseFinalExamDetails.id}/edit`
                    : "/platform"
                }
                iconRightTitle={<FiSettings size={24} />}
                hasLiButton={
                  user &&
                  ((user.user_role_id === 3 &&
                    user.platform_user_business_id ===
                      courseDetails.platform_user_business_id) ||
                    user.user_role_id === 4 ||
                    user.user_role_id === 5)
                }
                iconRight={<FiEdit size={24} />}
                hasExtraLiButton={true}
                extraButtonRoute={`/platform/courses/${courseId}/final_exam/${courseFinalExamDetails.id}/attempt`}
                extraButtonRouteTitle="Realizar examen final"
                extraIconRight={<FaGraduationCap size={24} />}
              />
            </>
          )}

          {((courseDetails.has_final_exam && isApproved) ||
            (courseDetails.has_final_exam == false &&
              totalProgressCompletion === "100.00")) && (
            <div className="box-theme font-semibold">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg text-primary">Certificación</h3>
                <Button
                  customClasses="w-10 h-10 p-0 rounded-full shadow-md duration-300 hover:-translate-y-1 flex items-center justify-center text-blue-500 border-dark-mode"
                  title={"Descargar certificado"}
                  customFunction={() =>
                    downloadCertificate(
                      user_fullname,
                      courseDetails.name,
                      course_hours_to_complete,
                      user_dni_ssn
                    )
                  }
                  icon={<FaFileDownload size={24} />}
                />
              </div>
              <p className="text-sm text-gray-500">
                ¡Felicidades! Has completado el curso con éxito. Descarga tu
                certificado de finalización.
              </p>
            </div>
          )}
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
