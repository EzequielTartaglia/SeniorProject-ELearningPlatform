"use client";

import { getCourse } from "@/src/controllers/platform/course/course";
import { checkStudentCourseEnrollment } from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";
import { checkStudentCourseEnrollmentFinalExamAttempt } from "@/src/controllers/platform/student_course_enrollment_final_exam_attempt/student_course_enrollment_final_exam_attempt";
import { getFinalExamQuestionsAndOptions } from "@/src/controllers/platform/course_final_exam_option_answer/course_final_exam_option_answer";
import { addStudentCourseEnrollmentFinalExamAttemptTry } from "@/src/controllers/platform/student_course_enrollment_final_exam_attempt_try/student_course_enrollment_final_exam_attempt_try";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useNotification } from "@/contexts/NotificationContext";

import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import formatDate from "@/src/helpers/formatDate";
import LoadingSpinner from "@/components/LoadingSpinner";
import Image from "next/image";

export default function TryStudentFinalExamAttemptForm({
  courseId,
  finalExamId,
  attemptId,
}) {
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [course, setCourse] = useState();
  const [isLock, setIsLock] = useState(false);
  const [expirationDate, setExpirationDate] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function checkEnrollment() {
      try {
        const courseDetails = await getCourse(courseId);
        setCourse(courseDetails);

        const enrollment = await checkStudentCourseEnrollment(
          user.id,
          courseId
        );
        if (!enrollment) {
          setIsEnrolled(false);
          return;
        }

        setIsEnrolled(true);

        const attempt = await checkStudentCourseEnrollmentFinalExamAttempt(
          enrollment.id
        );
        if (attempt) {
          setIsLock(attempt.is_lock);
          setExpirationDate(attempt.lock_expiration_date);
        }

        const questionsData = await getFinalExamQuestionsAndOptions(
          finalExamId
        );
        setQuestions(questionsData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    checkEnrollment();
  }, [user.id, courseId, finalExamId]);

  const handleAdd = async () => {
    if (isLock) {
      alert(
        "No puedes realizar un nuevo intento porque el examen está bloqueado."
      );
      return;
    }

    setIsSubmitted(true);
    setIsLoading(true);

    try {
      let totalScore = 0;

      questions.forEach((question) => {
        const correctOptions = question.course_final_exam_option_answers
          .filter((option) => option.is_correct)
          .map((option) => option.id);

        const userSelectedOptions = selectedAnswers[question.id] || [];

        const correctUserSelections = userSelectedOptions.filter((optionId) =>
          correctOptions.includes(optionId)
        );

        const incorrectUserSelections = userSelectedOptions.filter(
          (optionId) => !correctOptions.includes(optionId)
        );

        // Calculate score for this question
        let score = 0;
        const totalCorrectOptionsCount = correctOptions.length;

        if (incorrectUserSelections.length === 0) {
          // If there are no incorrect selections
          if (correctUserSelections.length === totalCorrectOptionsCount) {
            // All correct options selected
            score = question.points_assigned;
          } else {
            // Proportional score based on correct selections
            const proportionalFactor =
              correctUserSelections.length / totalCorrectOptionsCount;
            score = proportionalFactor * question.points_assigned;
          }
        } else {
          // At least one incorrect selection
          score = 0;
        }

        // Ensure score doesn't go below 0
        score = Math.max(score, 0);

        totalScore += score;
      });

      // Round total score to 2 decimal places if necessary
      totalScore = Math.round(totalScore * 100) / 100;

      // Add attempt with calculated total score and selected answers
      await addStudentCourseEnrollmentFinalExamAttemptTry(
        attemptId,
        totalScore,
        selectedAnswers
      );

      showNotification("¡Examen entregado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(
          `/platform/courses/${courseId}/final_exam/${finalExamId}/attempt`
        );
      }, 2000);

      setIsLoading(false);
    } catch (error) {
      alert("Error al agregar intento: " + error.message);
      setIsLoading(false);
    }
  };

  const handleOptionChange = (questionId, optionId) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [questionId]: prevSelectedAnswers[questionId]
        ? prevSelectedAnswers[questionId].includes(optionId)
          ? prevSelectedAnswers[questionId].filter((id) => id !== optionId)
          : [...prevSelectedAnswers[questionId], optionId]
        : [optionId],
    }));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  if (!isEnrolled) {
    return <p>No estás inscripto en este curso.</p>;
  }

  return (
    <>
      {isLock ? (
        <>
          <PageHeader
            title={course.name}
            subtitle={"Examen Final"}
            goBackText={"Volver al examen final"}
            goBackRoute={`/platform/courses/${courseId}/final_exam/${finalExamId}/attempt`}
          />
          <div className="p-4 bg-secondary border border-red-400 text-red-700 rounded">
            <p className="text-lg text-center font-semibold">
              Examen Bloqueado
            </p>
            <p>
              No puedes realizar un nuevo intento hasta el dia{" "}
              {formatDate(expirationDate)}
            </p>
          </div>
        </>
      ) : (
        <>
          <PageHeader title={course.name} subtitle={"Examen Final"} />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="box-theme"
          >
            {questions.map((question) => (
              <div key={question.id} className="p-4 bg-dark-mode border-dark-mode rounded my-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-semibold">
                    {question.question_text}
                  </p>
                  <p className="text-sm text-gray-400">
                    Puntos: {question.points_assigned}
                  </p>
                </div>
                <div className="pl-4 mt-2 space-y-2">
                  {question.has_image && question.question_image_link && (
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
                  {question.course_final_exam_option_answers.map((option) => (
                    <label
                      key={option.id}
                      className="flex items-center space-x-2 bg-white text-black font-semibold p-2 rounded hover:bg-gray-600 transition cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={
                          selectedAnswers[question.id]?.includes(option.id) ||
                          false
                        }
                        onChange={() =>
                          handleOptionChange(question.id, option.id)
                        }
                        className="form-checkbox text-black"
                      />
                      <span>{option.answer_text}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <SubmitLoadingButton isLoading={isLoading} type="submit">
              Finalizar Examen
            </SubmitLoadingButton>
          </form>
        </>
      )}
    </>
  );
}
