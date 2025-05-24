"use client";

import {
  getCourseFinalExamQuestion,
  editCourseFinalExamQuestion,
} from "@/src/models/platform/course_final_exam_question/course_final_exam_question";
import { getCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import FileInput from "@/components/forms/FileInput";
import CheckboxInput from "@/components/forms/CheckboxInput";
import Image from "next/image";

export default function EditCourseFinalExamQuestionForm({
  courseId,
  finalExamId,
  questionId,
}) {
  const [courseFinalExamTitle, setCourseFinalExamTitle] = useState("");
  const [courseFinalExamQuestion, setCourseFinalExamQuestion] = useState({
    question_text: "",
    points_assigned: 0,
    has_image: false,
    question_image_link: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseFinalExamQuestion = async () => {
      try {
        const fetchedCourseFinalExam = await getCourseFinalExam(courseId);
        setCourseFinalExamTitle(fetchedCourseFinalExam.title);

        const fetchedCourseFinalExamQuestion = await getCourseFinalExamQuestion(
          questionId
        );
        setCourseFinalExamQuestion(fetchedCourseFinalExamQuestion);
      } catch (error) {
        console.error("Error fetching final exam:", error.message);
      }
    };
    fetchCourseFinalExamQuestion();
  }, [courseId, finalExamId, questionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { question_text, points_assigned, has_image, question_image_link } = courseFinalExamQuestion;

    if (!question_text || !points_assigned) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true);

    try {
      await editCourseFinalExamQuestion(
        questionId,
        question_text,
        points_assigned,
        has_image,
        has_image ? question_image_link : null
      );

      showNotification("¡Pregunta editada exitosamente!", "success");

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
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setCourseFinalExamQuestion({
      ...courseFinalExamQuestion,
      [name]: newValue,
    });
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
        subtitle="Editar pregunta"
        goBackRoute={`/platform/courses/${courseId}/final_exam/manage`}
        goBackText="Volver a detalles del examen final"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Pregunta"
          name="question_text"
          value={courseFinalExamQuestion.question_text || ""}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <Input
          label="Puntos Asignados"
          name="points_assigned"
          value={courseFinalExamQuestion.points_assigned || ""}
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
          <>
            <label
              htmlFor="question_image_link"
              className="mt-2 block text-lg font-medium text-primary"
            >
              Miniatura de Imagen
            </label>
            {courseFinalExamQuestion.question_image_link && (
              <div className="mt-2">
                <Image
                  src={courseFinalExamQuestion.question_image_link}
                  alt="Vista previa"
                  width={150}
                  height={150}
                  className="border rounded-md"
                  unoptimized
                />
              </div>
            )}
          </>
        )}

        {courseFinalExamQuestion.has_image && (
          <div className="mt-4">
            <FileInput
              name="questionImage"
              onChange={handleFileChange}
              onUploadSuccess={handleFileUploadSuccess}
              showPreview={false}
            />
          </div>
        )}

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar pregunta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
