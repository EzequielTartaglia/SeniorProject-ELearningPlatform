"use client";

import { getCourseFinalExam } from "@/src/models/platform/course_final_exam/course_final_exam";
import { getCourse } from "@/src/models/platform/course/course";
import { deleteCourseFinalExamQuestion } from "@/src/models/platform/course_final_exam_question/course_final_exam_question";
import {
  getFinalExamQuestionsAndOptions,
  deleteCourseFinalExamQuestionAnswer,
} from "@/src/models/platform/course_final_exam_option_answer/course_final_exam_option_answer";

import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";

import {
  FiEdit,
  FiChevronDown,
  FiPlus,
  FiTrash,
  FiChevronUp,
} from "react-icons/fi";
import Link from "next/link";
import PageHeader from "@/components/page_formats/PageHeader";
import ExamDetailCard from "./ExamDetailCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function CourseFinalExamManagePage({ courseId }) {
  const [finalExamDetails, setFinalExamDetails] = useState(null);
  const [courseDetails, setCourseDetails] = useState(null);
  const [finalExamQuestionsWithAnswers, setFinalExamQuestionsWithAnswers] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [questionExpanded, setQuestionExpanded] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);

  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        const courseDetails = await getCourse(courseId);
        setCourseDetails(courseDetails);

        const finalExamDetails = await getCourseFinalExam(courseId);
        setFinalExamDetails(finalExamDetails);

        const finalExamQuestionsWithAnswersDetail =
          await getFinalExamQuestionsAndOptions(finalExamDetails.id);
        setFinalExamQuestionsWithAnswers(finalExamQuestionsWithAnswersDetail);

        const total = finalExamQuestionsWithAnswersDetail.reduce(
          (acc, question) => acc + question.points_assigned,
          0
        );
        setTotalPoints(total);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
        setQuestionsLoading(false);
      }
    }

    fetchData();
  }, [courseId]);

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteCourseFinalExamQuestion(questionId);

      showNotification("Pregunta eliminada exitosamente!", "info");

      setFinalExamQuestionsWithAnswers((prevQuestions) =>
        prevQuestions.filter((question) => question.id !== questionId)
      );
    } catch (error) {
      console.error("Error al eliminar la pregunta:", error.message);
    }
  };

  const handleDeleteAnswer = async (answerId) => {
    try {
      await deleteCourseFinalExamQuestionAnswer(answerId);

      showNotification("Opcion eliminada exitosamente!", "info");

      setFinalExamQuestionsWithAnswers((prevQuestions) =>
        prevQuestions.map((question) => ({
          ...question,
          course_final_exam_option_answers:
            question.course_final_exam_option_answers.filter(
              (answer) => answer.id !== answerId
            ),
        }))
      );
    } catch (error) {
      console.error("Error al eliminar la respuesta:", error.message);
    }
  };

  const handleToggle = (questionId) => {
    setQuestionExpanded((prevExpanded) => ({
      ...prevExpanded,
      [questionId]: !prevExpanded[questionId],
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {finalExamDetails ? (
        <>
          <PageHeader
            title={courseDetails.name}
            subtitle={"Administración de Examen Final"}
            goBackText={"Volver a detalles del curso"}
            goBackRoute={`/platform/courses/${courseId}`}
          />

          <ExamDetailCard
            title={finalExamDetails.title}
            description={finalExamDetails.description}
            minScore={finalExamDetails.min_score_to_pass}
            questionsCount={finalExamQuestionsWithAnswers.length}
            totalPoints={totalPoints}
            editRoute={`/platform/courses/${courseId}/final_exam/${finalExamDetails?.id}/edit`}
          />

          <div className="box-theme font-semibold">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-primary">Preguntas</h3>
              <Link
                href={`/platform/courses/${courseId}/final_exam/${finalExamDetails?.id}/question/new`}
              >
                <button
                  className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1"
                  title="Agregar"
                >
                  <FiPlus size={24} />
                </button>
              </Link>
            </div>

            {questionsLoading ? (
              <div className="flex justify-center items-center h-16">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 spinner-border border-opacity-50"></div>
              </div>
            ) : (
              <div className="flex flex-col gap-5 list-none p-0 w-full text-primary">
                {finalExamQuestionsWithAnswers.length > 0 ? (
                  finalExamQuestionsWithAnswers.map((question) => (
                    <div key={question.id} className="w-full">
                      <div
                        className="flex items-center justify-between bg-primary text-primary rounded-md px-6 py-3 shadow-md transition duration-300 hover:-translate-y-1 hover:bg-primary-hover-500 w-full border-primary cursor-pointer"
                        onClick={() => handleToggle(question.id)}
                      >
                        {questionExpanded[question.id] ? (
                          <FiChevronUp size={24} />
                        ) : (
                          <FiChevronDown size={24} />
                        )}
                        <span className="truncate pr-4">
                          {question.question_text}
                        </span>
                        <div className="flex-row items-center space-x-2">
                          <Link
                            href={`/platform/courses/${courseId}/final_exam/${finalExamDetails?.id}/question/${question.id}/answer/new`}
                          >
                            <button
                              className="text-show-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiPlus size={24} />
                            </button>
                          </Link>
                          <Link
                            href={`/platform/courses/${courseId}/final_exam/${finalExamDetails?.id}/question/${question.id}/edit`}
                          >
                            <button
                              className="text-edit-link"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <FiEdit size={24} />
                            </button>
                          </Link>
                          <button
                            className="text-delete-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteQuestion(question.id);
                            }}
                          >
                            <FiTrash size={24} />
                          </button>
                        </div>
                      </div>
                      {questionExpanded[question.id] && (
                        <div className="mt-2 pl-4 bg-secondary rounded-lg p-4">
                          {question.has_image && (
                            <>
                              {question.question_image_link && (
                                <div className="my-4 flex justify-center">
                                  <Image
                                    src={question.question_image_link}
                                    alt="Vista previa"
                                    width={600}
                                    height={600}
                                    className="h-auto border rounded-md"
                                    unoptimized
                                  />
                                </div>
                              )}
                            </>
                          )}

                          <h4 className="text-lg font-semibold text-primary mb-4">
                            Opciones de respuesta
                          </h4>
                          <ul className="list-inside">
                            {question.course_final_exam_option_answers.length >
                            0 ? (
                              question.course_final_exam_option_answers.map(
                                (answer, index) => (
                                  <div
                                    key={answer.id}
                                    className={`flex justify-between items-center mb-2 ${
                                      index !==
                                        question
                                          .course_final_exam_option_answers
                                          .length -
                                          1 && "border-b border-gray-200"
                                    }`}
                                  >
                                    <li
                                      className={`flex-1 mb-1 ${
                                        answer.is_correct
                                          ? "text-show-link-active"
                                          : "text-delete-link-active"
                                      }`}
                                    >
                                      {answer.answer_text}
                                    </li>
                                    <div className="flex-row items-center space-x-2 ml-4">
                                      <Link
                                        href={`/platform/courses/${courseId}/final_exam/${finalExamDetails?.id}/question/${question.id}//answer/${answer.id}/edit`}
                                      >
                                        <button
                                          className="text-edit-link"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <FiEdit size={24} />
                                        </button>
                                      </Link>
                                      <button
                                        className="text-delete-link"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDeleteAnswer(answer.id);
                                        }}
                                      >
                                        <FiTrash size={24} />
                                      </button>
                                    </div>
                                  </div>
                                )
                              )
                            ) : (
                              <ul className="shadow-md rounded-lg p-1 bg-primary mt-4 relative w-full bg-secondary">
                                <li className="text-center py-2 text-center text-gray-400">
                                  <p>No hay nada para mostrar.</p>
                                </li>
                              </ul>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <ul className="shadow-md rounded-lg p-1 bg-primary mt-4 relative w-full bg-secondary">
                    <li className="text-center py-2 text-center text-gray-400">
                      <p>No hay nada para mostrar.</p>
                    </li>
                  </ul>
                )}
              </div>
            )}
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
