'use client';

import { addCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";

import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import GoBackButton from "@/components/GoBackButton";
import Input from "@/components/forms/Input";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddCourseFinalExamForm({ courseId }) {
  const [courseFinalExam, setCourseFinalExam] = useState({
    title: "Examen Final",
    description: "",
    min_score_to_pass: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseFinalExam((prevCourseFinalExam) => ({
      ...prevCourseFinalExam,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, min_score_to_pass } = courseFinalExam;

    if (!title) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true);

    try {
      await addCourseFinalExam(courseId, title, description, min_score_to_pass);
      
      showNotification("¡Examen final agregado exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}`);
      }, 2000);

    } catch (error) {
      console.error("Error al agregar curso:", error.message);
      setIsLoading(false); 
    }
  };

  return (
    <div className="flex flex-col items-center h-screen p-2 w-full">
      <div className="w-full max-w-lg flex justify-between mb-4">
        <GoBackButton
          route={`/platform/courses/${courseId}`}
          customClasses="mb-4 md:mb-0 md:mr-4"
          text={"Volver a detalles del curso"}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Título"
          name="title"
          value={courseFinalExam.title}
          required={true}
          placeholder="Título del examen"
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />
        <Input
          label="Descripción"
          name="description"
          value={courseFinalExam.description}
          placeholder="Descripción del examen"
          onChange={handleChange}
        />
        <Input
          label="Puntuación mínima para aprobar (%)"
          name="min_score_to_pass"
          value={courseFinalExam.min_score_to_pass}
          required={true}
          placeholder="Puntuación mínima"
          onChange={handleChange}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar Examen Final
        </SubmitLoadingButton>
      </form>
    </div>
  );
}
