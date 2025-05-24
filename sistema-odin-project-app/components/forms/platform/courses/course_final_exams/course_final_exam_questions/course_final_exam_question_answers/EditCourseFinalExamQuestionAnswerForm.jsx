'use client';

import { getCourseFinalExamQuestion } from "@/src/models/platform/course_final_exam_question/course_final_exam_question";
import {
  getCourseFinalExamOptionAnswer,
  editCourseFinalExamOptionAnswer,
} from "@/src/models/platform/course_final_exam_option_answer/course_final_exam_option_answer";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import CheckboxInput from "@/components/forms/CheckboxInput";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function EditCourseFinalExamQuestionAnswerForm({
  courseId,
  questionId,
  answerId,
}) {
  const [courseFinalExamQuestionText, setCourseFinalExamQuestionText] =
    useState("");
  const [courseFinalExamQuestionAnswer, setCourseFinalExamQuestionAnswer] =
    useState({
      answer_text: "",
      is_correct: false,
    });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseFinalExamQuestion = async () => {
      try {
        const fetchedCourseFinalExamQuestion = await getCourseFinalExamQuestion(
          questionId
        );
        setCourseFinalExamQuestionText(
          fetchedCourseFinalExamQuestion.question_text
        );

        const fetchedCourseFinalExamQuestionAnswer =
          await getCourseFinalExamOptionAnswer(answerId);
        setCourseFinalExamQuestionAnswer(fetchedCourseFinalExamQuestionAnswer);
      } catch (error) {
        console.error("Error al obtener el examen final:", error.message);
      }
    };
    fetchCourseFinalExamQuestion();
  }, [answerId, courseId, questionId]);

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
      await editCourseFinalExamOptionAnswer(answerId, answer_text, is_correct);
      
      showNotification("¡Opción de respuesta editada exitosamente!", "success");
      
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
    setCourseFinalExamQuestionAnswer({
      ...courseFinalExamQuestionAnswer,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    const { checked } = e.target;
    setCourseFinalExamQuestionAnswer((prev) => ({
      ...prev,
      is_correct: checked,
    }));
  };
  
  return (
    <>
      <PageHeader
        title={courseFinalExamQuestionText || "Cargando..."}
        subtitle="Editar respuesta"
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
          value={courseFinalExamQuestionAnswer.answer_text || ""}
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
          Editar respuesta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
