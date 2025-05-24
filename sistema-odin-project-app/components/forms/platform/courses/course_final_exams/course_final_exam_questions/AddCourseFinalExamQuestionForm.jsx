"use client";

import { addCourseFinalExamQuestion } from "@/src/models/platform/course_final_exam_question/course_final_exam_question";
import { getCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import FileInput from "@/components/forms/FileInput";
import CheckboxInput from "@/components/forms/CheckboxInput";

export default function AddCourseFinalExamQuestionForm({
  finalExamId,
  courseId,
}) {
  const [courseFinalExamTitle, setCourseFinalExamTitle] = useState("");
  const [courseFinalExamQuestion, setCourseFinalExamQuestion] = useState({
    question_text: "",
    points_assigned: "",
    has_image: false,
    question_image_link: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchCourseFinalExam() {
      try {
        const courseFinalExamDetails = await getCourseFinalExam(courseId);
        setCourseFinalExamTitle(courseFinalExamDetails.title);
      } catch (error) {
        console.error(
          "Error fetching final exam:",
          error.message
        );
      }
    }

    fetchCourseFinalExam();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setCourseFinalExamQuestion((prevCourseFinalExamQuestion) => ({
      ...prevCourseFinalExamQuestion,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { question_text, points_assigned, has_image, question_image_link } =
      courseFinalExamQuestion;

    if (
      !question_text ||
      !points_assigned ||
      (has_image && !question_image_link)
    ) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true);

    try {
      await addCourseFinalExamQuestion(
        finalExamId,
        question_text,
        points_assigned,
        has_image,
        has_image ? question_image_link : null
      );

      showNotification(
        "¡Pregunta del examen final agregada exitosamente!",
        "success"
      );

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}/final_exam/manage`);
      }, 2000);
    } catch (error) {
      console.error(
        "Error al agregar pregunta al examen final:",
        error.message
      );
      setIsLoading(false);
    }
  };

  const handleFileUploadSuccess = (url) => {
    setCourseFinalExamQuestion((prevCourseFinalExamQuestion) => ({
      ...prevCourseFinalExamQuestion,
      question_image_link: url,
    }));
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
  };

  return (
    <>
      <PageHeader
        title={courseFinalExamTitle || "Cargando..."}
        subtitle="Nueva pregunta"
        goBackRoute={`/platform/courses/${courseId}/final_exam/manage`}
        goBackText="Volver a detalles del examen final"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Pregunta"
          name="question_text"
          value={courseFinalExamQuestion.question_text}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />
        <Input
          label="Puntos Asignados"
          name="points_assigned"
          value={courseFinalExamQuestion.points_assigned}
          required={true}
          placeholder="Ingrese los puntos asignados"
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <CheckboxInput
          id="has_image"
          name="has_image"
          label="¿Tiene una imagen de referencia?"
          checked={courseFinalExamQuestion.has_image}
          onChange={handleChange}
        />

        {courseFinalExamQuestion.has_image && (
          <div className="mt-4">
            <h3 className="text-lg font-medium">Imagen de referencia</h3>
            <FileInput
              name="questionImage"
              onChange={handleFileChange}
              onUploadSuccess={handleFileUploadSuccess}
              showLink={false}
            />
          </div>
        )}

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar Pregunta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
