"use client";

import {
  getCourseFinalExam,
  editCourseFinalExam,
} from "@/src/models/platform/course_final_exam/course_final_exam";
import { getCourse } from "@/src/models/platform/course/course";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function EditCourseFinalExamForm({ courseId, finalExamId }) {
  const [courseName, setCourseName] = useState("");
  const [courseFinalExam, setCourseFinalExam] = useState({
    title: undefined,
    description: undefined,
    min_score_to_pass: undefined,
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseFinalExam = async () => {
      try {
        const fetchedCourse = await getCourse(courseId);
        setCourseName(fetchedCourse);

        const fetchedCourseFinalExam = await getCourseFinalExam(courseId);
        setCourseFinalExam(fetchedCourseFinalExam);
      } catch (error) {
        console.error("Error al obtener el examen final:", error.message);
      }
    };
    fetchCourseFinalExam();
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, min_score_to_pass } = courseFinalExam;

    if (!title || !min_score_to_pass) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true); 

    try {
      await editCourseFinalExam(
        finalExamId,
        title,
        description,
        min_score_to_pass
      );
      
      showNotification("¡Examen final editado exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}/final_exam/manage`);
      }, 2000);

    } catch (error) {
      console.error("Error al editar el examen:", error.message);
      setIsLoading(false); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseFinalExam({
      ...courseFinalExam,
      [name]: value,
    });
  };

  return (
    <>
      <PageHeader
        title={courseName.name || "Cargando..."}
        goBackRoute={`/platform/courses/${courseId}/final_exam/manage`}
        goBackText={"Volver a detalles del examen final"}
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Título"
          name="title"
          value={courseFinalExam.title || ""}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <Input
          label="Descripción"
          name="description"
          value={courseFinalExam.description || ""}
          placeholder=""
          onChange={handleChange}
        />

        <Input
          label="Puntuación mínima para aprobar (%)"
          name="min_score_to_pass"
          value={courseFinalExam.min_score_to_pass || ""}
          required={true}
          type="number"
          placeholder="70"
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar Examen Final
        </SubmitLoadingButton>
      </form>
    </>
  );
}
