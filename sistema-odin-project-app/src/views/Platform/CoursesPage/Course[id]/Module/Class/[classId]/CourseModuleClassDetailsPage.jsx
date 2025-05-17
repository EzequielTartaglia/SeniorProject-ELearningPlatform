"use client";

import { useEffect, useState } from "react";
import { getCourseModuleClassSingle } from "@/src/controllers/platform/course_module_class/course_module_class";
import CourseModuleClassFormat from "../CourseModuleClassFormat";
import CourseModuleClassPlatformTool from "../CourseModuleClassPlatformTool";
import { getCourseModule } from "@/src/controllers/platform/course_module/courses_module";
import YouTubePreview from "@/components/YouTubeVideoPreview";
import PageHeader from "@/components/page_formats/PageHeader";
import Link from "next/link";
import formatTimeFromMinutesToHoursAndMinutes from "@/src/helpers/formatTimeFromMinutesToHoursAndMinutes";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getCourseModulesAndClasses } from "@/src/controllers/platform/course/course";
import Button from "@/components/Button";
import { FiCheckCircle, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  addStudentCourseModuleClassProgress,
  checkIfProgressExists,
  getExistingProgressFromUserEnrollmentAndClass,
  deleteStudentCourseModuleClassProgress,
} from "@/src/controllers/platform/student_course_module_class_progress/student_course_module_class_progress";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { getStudentCourseEnrollmentsSingleUserAndCourse } from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";

export default function CourseModuleClassDetailsPage({
  courseId,
  moduleId,
  classId,
}) {
  const [classDetails, setClassDetails] = useState(null);
  const [courseModuleDetails, setModuleCourseDetails] = useState(null);
  const [allClasses, setAllClasses] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const { user } = useUserInfoContext();

  useEffect(() => {
    async function fetchDetails() {
      try {
        const classDetailsResponse = await getCourseModuleClassSingle(classId);
        setClassDetails(classDetailsResponse);

        const moduleDetails = await getCourseModule(moduleId);
        setModuleCourseDetails(moduleDetails);

        const allModulesAndClasses = await getCourseModulesAndClasses(courseId);
        setAllClasses(
          allModulesAndClasses.flatMap((module) => module.moduleClasses)
        );

        const enrollment = await getStudentCourseEnrollmentsSingleUserAndCourse(
          user.id,
          courseId
        );

        if (enrollment) {
          const isCompletedClass = await checkIfProgressExists(
            user.id,
            enrollment.id,
            classId
          );

          setIsCompleted(isCompletedClass);
        }
      } catch (error) {
        console.error(
          "Error intentando obtener los detalles de la clase:",
          error.message
        );
      }
    }

    fetchDetails();
  }, [courseId, moduleId, classId, user.id]);

  const currentIndex = allClasses.findIndex(
    (cls) => cls.id === classDetails?.id
  );

  const prevClass = allClasses[currentIndex + 1];
  const nextClass = allClasses[currentIndex - 1];

  async function handleCompleteAndContinue() {
    try {
      const enrollment = await getStudentCourseEnrollmentsSingleUserAndCourse(
        user.id,
        courseId
      );

      if (!enrollment) {
        throw new Error(
          "No se encontró la matrícula del estudiante para este curso."
        );
      }

      await addStudentCourseModuleClassProgress(
        enrollment.id,
        classId,
        user.id,
        true
      );

      if (nextClass) {
        window.location.href = `/platform/courses/${courseId}/modules/${nextClass.course_module_id}/class/${nextClass.id}`;
      }
    } catch (error) {
      console.error("Error trying to complete class:", error.message);
    }
  }

  async function handleIncomplete() {
    try {
      const enrollment = await getStudentCourseEnrollmentsSingleUserAndCourse(
        user.id,
        courseId
      );

      if (!enrollment) {
        throw new Error(
          "No se encontró la matrícula del estudiante para este curso."
        );
      }

      const userProgressFetched =
        await getExistingProgressFromUserEnrollmentAndClass(
          user.id,
          enrollment.id,
          classId
        );

      await deleteStudentCourseModuleClassProgress(userProgressFetched.id);

      setIsCompleted(false);

    } catch (error) {
      console.error("Error trying to complete class:", error.message);
    }
  }

  return (
    <>
      {courseModuleDetails && classDetails ? (
        <>
          <PageHeader
            title={courseModuleDetails.title || "Cargando..."}
            subtitle={classDetails.title}
            goBackRoute={`/platform/courses/${courseId}`}
            goBackText="Volver al curso"
          />

          {classDetails.has_video && classDetails.video_link && (
            <div className="box-theme">
              <YouTubePreview videoId={classDetails.video_link} />
            </div>
          )}
          <div className="box-theme">
            <h3 className="text-xl font-semibold text-title-active-static mb-4">
              Detalles de la clase:
            </h3>

            <div className="mb-4">
              <span className="block text-lg font-semibold text-title-active-static">
                Tiempo estimado de la clase:
              </span>
              {classDetails.time_to_complete ? (
                <p className="text-primary font-semibold">
                  {
                    formatTimeFromMinutesToHoursAndMinutes(
                      classDetails.time_to_complete
                    ).hours
                  }{" "}
                  horas{" "}
                  {
                    formatTimeFromMinutesToHoursAndMinutes(
                      classDetails.time_to_complete
                    ).minutes
                  }{" "}
                  minutos
                </p>
              ) : (
                <p className="text-primary font-semibold">No especificado</p>
              )}
            </div>

            <div className="mb-4">
              <span className="block text-lg font-semibold text-title-active-static">
                Descripción:
              </span>
              <p className="text-primary font-semibold">
                {classDetails.description}
              </p>
            </div>

            <div className="mb-4">
              <span className="block text-lg font-semibold text-title-active-static">
                Formato de clase:
              </span>
              {classDetails.course_format_id ? (
                <CourseModuleClassFormat
                  courseModuleClassFormatId={classDetails.course_format_id}
                  className="text-primary font-semibold"
                />
              ) : (
                <span className="text-primary font-semibold">
                  Sin especificar
                </span>
              )}
            </div>

            <div className="mb-4">
              <span className="block text-lg font-semibold text-title-active-static">
                Plataforma:
              </span>
              {classDetails.course_platform_tool_id ? (
                <CourseModuleClassPlatformTool
                  courseModuleClassPlatformToolId={
                    classDetails.course_platform_tool_id
                  }
                  className="text-primary font-semibold"
                />
              ) : (
                <span className="text-primary font-semibold">
                  Sin especificar
                </span>
              )}
            </div>

            {classDetails.drive_link && (
              <div className="mb-4">
                <p className="text-primary font-semibold mb-5">
                  Material complementario:
                  <br />
                  <span className="mr-3">-</span>
                  <Link
                    href={classDetails.drive_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-title-active hover:text-gold"
                  >
                    Drive
                  </Link>
                </p>
              </div>
            )}
          </div>
          <div className="relative mt-8 px-4">
            {(prevClass || nextClass) && (
              <div className="flex justify-center">
                <hr className="my-4 border-gray-300 w-3/5" />
              </div>
            )}

            <div className="flex justify-between w-full gap-4 md:gap-8 text-sm md:text-lg">
              {prevClass ? (
                <>
                  <div
                    className="flex flex-col items-center sm:min-w-[700px] sm:max-w-[700px]
          md:min-w-[800px] md:max-w-[800px]
          lg:min-w-[860px] lg:max-w-[1280px]
          xl:min-w-[1280px] xl:max-w-[1536px]"
                  >
                    <Button
                      route={`/platform/courses/${courseId}/modules/${prevClass.course_module_id}/class/${prevClass.id}`}
                      customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light font-semibold bg-dark-mode"
                      icon={<FiChevronLeft />}
                      iconPosition="left"
                      text={"Anterior"}
                      title={"Anterior"}
                    />
                  </div>

                  {!isCompleted ? (
                    <Button
                      customFunction={handleCompleteAndContinue}
                      customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light font-semibold bg-dark-mode"
                      text="Completar"
                      icon={<FiCheckCircle />}
                      title="Completar y continuar"
                    />
                  ) : (
                    <Button
                      customClasses="text-lg font-semibold px-2 py-1 rounded bg-green-400 text-green-700 border-2 border-green-700"
                      text="Completado"
                      icon={<FiCheckCircle />}
                      title="Clase completada"
                      customFunction={handleIncomplete}
                    />
                  )}
                </>
              ) : (
                <>
                  <div
                    className="flex flex-col items-center sm:min-w-[700px] sm:max-w-[700px]
        md:min-w-[800px] md:max-w-[800px]
        lg:min-w-[860px] lg:max-w-[1280px]
        xl:min-w-[1280px] xl:max-w-[1536px]"
                  ></div>

                  {!isCompleted ? (
                    <Button
                      customFunction={handleCompleteAndContinue}
                      customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light font-semibold bg-dark-mode"
                      text="Completar"
                      icon={<FiCheckCircle />}
                      title="Completar y continuar"
                    />
                  ) : (
                    <Button
                      customClasses="text-lg font-semibold px-2 py-1 rounded bg-green-400 text-green-700 border-2 border-green-700 "
                      text="Completado"
                      icon={<FiCheckCircle />}
                      title="Clase completada"
                      customFunction={handleIncomplete}
                    />
                  )}
                </>
              )}

              {nextClass ? (
                <div
                  className="flex flex-col items-center sm:min-w-[700px] sm:max-w-[700px]
        md:min-w-[800px] md:max-w-[800px]
        lg:min-w-[860px] lg:max-w-[1280px]
        xl:min-w-[1280px] xl:max-w-[1536px]"
                >
                  <Button
                    route={`/platform/courses/${courseId}/modules/${nextClass.course_module_id}/class/${nextClass.id}`}
                    customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light font-semibold bg-dark-mode"
                    icon={<FiChevronRight />}
                    text={"Siguiente"}
                    title={"Siguiente"}
                  />
                </div>
              ) : (
                <div
                  className="flex flex-col items-center sm:min-w-[700px] sm:max-w-[700px]
      md:min-w-[800px] md:max-w-[800px]
      lg:min-w-[860px] lg:max-w-[1280px]
      xl:min-w-[1280px] xl:max-w-[1536px]"
                ></div>
              )}
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
