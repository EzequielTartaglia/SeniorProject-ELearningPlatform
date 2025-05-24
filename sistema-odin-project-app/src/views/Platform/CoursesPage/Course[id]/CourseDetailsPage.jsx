"use client";

import {
  getCourse,
  getCourseModulesAndClasses,
  getTotalTimeToComplete,
} from "@/src/models/platform/course/course";
import { getCourseLevels } from "@/src/models/platform/course_level/course_level";
import { deleteCourseModuleClass } from "@/src/models/platform/course_module_class/course_module_class";
import { deleteCourseModule } from "@/src/models/platform/course_module/courses_module";
import { getCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";
import { checkStudentCourseEnrollment } from "@/src/models/platform/student_course_enrollment/student_course_enrollment";
import {
  addStudentCourseEnrollmentFinalExamAttempt,
  checkStudentCourseEnrollmentFinalExamAttempt,
} from "@/src/models/platform/student_course_enrollment_final_exam_attempt/student_course_enrollment_final_exam_attempt";

import { useEffect, useState } from "react";
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
  const [courseFinalExamDetails, setCourseFinalExamDetails] = useState(null);
  const [enrollmentDetails, setEnrollmentDetails] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [courseLevels, setCourseLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const details = await getCourse(courseId);
        setCourseDetails(details);

        const courseLevelsFetched = await getCourseLevels();
        setCourseLevels(courseLevelsFetched);

        const timeToComplete = await getTotalTimeToComplete(courseId);
        setTotalTime(timeToComplete);

        const finalExamDetails = await getCourseFinalExam(courseId);
        setCourseFinalExamDetails(finalExamDetails);

        const modulesClasses = await getCourseModulesAndClasses(courseId);
        setModulesWithClasses(modulesClasses);

        const enrollment = await checkStudentCourseEnrollment(
          user.id,
          courseId
        );
        setEnrollmentDetails(enrollment);

        if (enrollment && details.has_final_exam) {
          const enrollmentId = enrollment.id;
          if (enrollmentId) {
            const hasAttempt =
              await checkStudentCourseEnrollmentFinalExamAttempt(enrollmentId);
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
          } else {
            console.error("Invalid enrollment ID:", enrollmentId);
          }
        }
      } catch (error) {
        console.error("Error fetching course details:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, user.id]);

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

  function findCourseLevel(courseLevelId, courseLevels) {
    const level = courseLevels.find((level) => level.id === courseLevelId);
    return level ? level.name : "Nivel no especificado";
  }

  const user_fullname = `${user.first_name} ${user.last_name}`;
  const user_dni_ssn = user.dni_ssn;
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

          {user && (user.user_role_id === 3 || user.user_role_id === 4) && (
            <div
              className="flex flex-col items-center md:items-end w-full 
                              sm:min-w-[700px] sm:max-w-[700px]   
                              md:min-w-[800px] md:max-w-[800px] 
                              lg:min-w-[860px] lg:max-w-[1280px] 
                              xl:min-w-[1280px] xl:max-w-[1536px]"
            >
              <Button
                route={`/platform/courses/${courseId}/edit`}
                customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
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
              level={findCourseLevel(
                courseDetails.course_level_id,
                courseLevels
              )}
            />
          )}
          <ModuleDropdownList
            title="Módulos"
            hasAddModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonAddModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
                ? `/platform/courses/${courseId}/modules/new`
                : "/platform"
            }
            modulesWithClasses={modulesWithClasses}
            hasAddClass={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonShowRoute={(moduleId, classId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/${classId}`
            }
            hasEditModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonEditRouteModule={(moduleId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/edit`
            }
            hasDeleteModule={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonDeleteModuleRoute={handleDeleteCourseModule}
            buttonAddRouteModuleClass={(moduleId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/new`
            }
            hasEditClass={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonEditRoute={(moduleId, classId) =>
              `/platform/courses/${courseId}/modules/${moduleId}/class/${classId}/edit`
            }
            hasDeleteClass={
              user && (user.user_role_id === 3 || user.user_role_id === 4)
            }
            buttonDeleteRoute={handleDeleteCourseModuleClass}
            columnName="title"
          />

          {modulesWithClasses.length > 0 && courseDetails.has_final_exam && (
            <>
              <LiWithTitle
                title="Examen Final"
                buttonTitle="Editar"
                hasIconRight={
                  user && (user.user_role_id === 3 || user.user_role_id === 4)
                }
                items={[courseFinalExamDetails?.title]}
                buttonRouteTitle={
                  user && (user.user_role_id === 3 || user.user_role_id === 4)
                    ? `/platform/courses/${courseId}/final_exam/manage`
                    : "/platform"
                }
                buttonRoute={`/platform/courses/${courseId}/final_exam/${courseFinalExamDetails.id}/edit`}
                iconRightTitle={<FiSettings size={24} />}
                iconRight={<FiEdit size={24} />}
                hasExtraLiButton={true}
                extraButtonRoute={`/platform/courses/${courseId}/final_exam/${courseFinalExamDetails.id}/attempt`}
                extraButtonRouteTitle="Realizar examen final"
                extraIconRight={<FaGraduationCap size={24} />}
              />
            </>
          )}

          {courseDetails.has_final_exam && isApproved && (
            <div className="box-theme font-semibold">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg text-primary">Certificación</h3>
                <Button
                  customClasses="w-10 h-10 p-0 rounded-full text-primary bg-secondary shadow-md duration-300 hover:-translate-y-1 flex items-center justify-center"
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
