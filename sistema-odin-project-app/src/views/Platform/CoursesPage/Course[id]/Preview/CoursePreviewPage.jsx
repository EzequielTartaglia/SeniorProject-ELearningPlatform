"use client";

import {
  getCourse,
  getTotalTimeToComplete,
} from "@/src/controllers/platform/course/course";
import { getCourseLevels } from "@/src/controllers/platform/course_level/course_level";
import { getCourseModules } from "@/src/controllers/platform/course_module/courses_module";
import { getPlatformProfessorUser } from "@/src/controllers/platform/platform_user/platform_professor_user";

import formatTimeFromMinutesToHoursAndMinutes from "@/src/helpers/formatTimeFromMinutesToHoursAndMinutes";
import { useEffect, useState } from "react";

import CourseDetailsCard from "../CourseDetailsCard";
import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import CallToActionWhatsAppButton from "@/components/buttons/CallToActionWhatsAppButton";

const CoursePreviewPage = ({ courseId }) => {
  const [courseDetails, setCourseDetails] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalTime, setTotalTime] = useState(0);

  const [courseLevels, setCourseLevels] = useState([]);
  const [courseModules, setCourseModules] = useState([]);

  useEffect(() => {
    async function fetchCourseDetails() {
      try {
        const details = await getCourse(courseId);
        setCourseDetails(details);

        const professorDetails = await getPlatformProfessorUser(details.professor_id);
        setProfessor(professorDetails || null);

        const timeToComplete = await getTotalTimeToComplete(courseId);
        setTotalTime(timeToComplete);

        const courseLevelsFetched = await getCourseLevels();
        setCourseLevels(courseLevelsFetched);

        const modules = await getCourseModules(courseId);
        setCourseModules(modules);

        setLoading(false);
      } catch (error) {
        console.error(
          "Error al obtener los detalles del curso:",
          error.message
        );
        setLoading(false);
      }
    }

    fetchCourseDetails();
  }, [courseId]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!courseDetails) {
    return <div>No se encontraron detalles del curso.</div>;
  }

  // Format total time to hours and minutes
  const formattedTime = formatTimeFromMinutesToHoursAndMinutes(totalTime);

  function findCourseLevel(courseLevelId, courseLevels) {
    const level = courseLevels.find((level) => level.id === courseLevelId);
    return level ? level.name : "Nivel no especificado";
  }

  return (
    <>
      <PageHeader
        title={courseDetails.name}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />

      <div
        className="flex flex-col items-center md:items-end w-full
        sm:min-w-[700px] sm:max-w-[700px]
        md:min-w-[800px] md:max-w-[800px]
        lg:min-w-[860px] lg:max-w-[1280px]
        xl:min-w-[1280px] xl:max-w-[1536px] mx-auto mt-8"
      >
        <CallToActionWhatsAppButton
          message={`Hola, me gustaria solicitar más información sobre el curso: ${courseDetails.name}.`}
          buttonTitle="Solicitar más información del curso "
        />
      </div>

      <CourseDetailsCard
        professor={professor}
        imageUrl={courseDetails.image_preview_link}
        moduleList={courseModules}
        description={courseDetails.description}
        totalTime={
          totalTime > 0
            ? `${formattedTime.hours} horas ${formattedTime.minutes} minutos`
            : ""
        }
        level={findCourseLevel(courseDetails.course_level_id, courseLevels)}
      />
    </>
  );
};

export default CoursePreviewPage;
