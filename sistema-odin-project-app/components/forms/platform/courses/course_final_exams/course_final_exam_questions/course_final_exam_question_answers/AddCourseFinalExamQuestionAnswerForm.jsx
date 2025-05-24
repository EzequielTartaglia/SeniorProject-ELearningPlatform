'use client';

import { getCourseFinalExamQuestion } from "@/src/models/platform/course_final_exam_question/course_final_exam_question";
import { addCourseFinalExamOptionsAnswer } from "@/src/models/platform/course_final_exam_option_answer/course_final_exam_option_answer";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import CheckboxInput from "@/components/forms/CheckboxInput";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddCourseFinalExamQuestionAnswerForm({ courseFinalExamQuestionId, courseId }) {
  const [courseFinalExamQuestionText, setCourseFinalExamQuestionText] = useState("");
  const [courseFinalExamQuestionAnswer, setCourseFinalExamQuestionAnswer] = useState({
    answer_text: "",
    is_correct: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchCourseFinalExamQuestion() {
      try {
        const courseFinalExamQuestionDetails = await getCourseFinalExamQuestion(courseFinalExamQuestionId);
        setCourseFinalExamQuestionText(courseFinalExamQuestionDetails.question_text);
      } catch (error) {
        console.error("Error al obtener detalles del examen final:", error.message);
      }
    }

    fetchCourseFinalExamQuestion();
  }, [courseFinalExamQuestionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseFinalExamQuestionAnswer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setCourseFinalExamQuestionAnswer((prev) => ({
      ...prev,
      is_correct: checked,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { answer_text, is_correct } = courseFinalExamQuestionAnswer;

    if (!answer_text) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true); 

    try {
      await addCourseFinalExamOptionsAnswer(courseFinalExamQuestionId, answer_text, is_correct);
      
      showNotification("¡Opción de respuesta agregada exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}/final_exam/manage`);
      }, 2000);

    } catch (error) {
      console.error("Error al agregar pregunta al examen final:", error.message);
      setIsLoading(false); 
    }
  };

  return (
    <>
      <PageHeader
        title={courseFinalExamQuestionText || "Cargando..."}
        subtitle="Nueva respuesta"
        goBackRoute={`/platform/courses/${courseId}/final_exam/manage`}
        goBackText="Volver a detalles del examen final"
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Respuesta"
          name="answer_text"
          value={courseFinalExamQuestionAnswer.answer_text}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <CheckboxInput
          id="is_correct"
          name="is_correct"
          label="¿Es correcta?"
          checked={courseFinalExamQuestionAnswer.is_correct}
          onChange={handleCheckboxChange}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar Respuesta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
