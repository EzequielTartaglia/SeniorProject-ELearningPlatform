"use client";

import { getCourse } from "@/src/models/platform/course/course";
import { checkStudentCourseEnrollment } from "@/src/models/platform/student_course_enrollment/student_course_enrollment";
import { getFinalExamQuestionsAndOptions } from "@/src/models/platform/course_final_exam_option_answer/course_final_exam_option_answer";
import { getStudentCourseEnrollmentFinalExamAttemptTriesFromEnrollment } from "@/src/models/platform/student_course_enrollment_final_exam_attempt_try/student_course_enrollment_final_exam_attempt_try";

import { useEffect, useState } from "react";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ViewStudentFinalExamAttemptForm({
    courseId,
    finalExamId,
    attemptId,
  }) {
    const [isEnrolled, setIsEnrolled] = useState(false);
    const [course, setCourse] = useState();
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    const { user } = useUserInfoContext();
  
    useEffect(() => {
      async function fetchData() {
        try {
          const courseDetails = await getCourse(courseId);
          setCourse(courseDetails);
  
          const enrollment = await checkStudentCourseEnrollment(user.id, courseId);
          if (!enrollment) {
            setIsEnrolled(false);
            return;
          }
  
          setIsEnrolled(true);
  
          const questionsData = await getFinalExamQuestionsAndOptions(finalExamId);
          setQuestions(questionsData);
  
          const attemptTries = await getStudentCourseEnrollmentFinalExamAttemptTriesFromEnrollment(attemptId);
          const lastAttemptTry = attemptTries[attemptTries.length - 1];
          setSelectedAnswers(lastAttemptTry.answers);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
  
      fetchData();
    }, [user.id, courseId, finalExamId, attemptId]);
  
    if (loading) return <LoadingSpinner/>;
    if (error) return <p>Error: {error}</p>;
  
    if (!isEnrolled) {
      return <p>No estás inscripto en este curso.</p>;
    }
  
    return (
      <>
        <PageHeader
          title={course.name}
          subtitle={"Revisión de examen final"}
          goBackText={"Volver al examen final"}
          goBackRoute={`/platform/courses/${courseId}/final_exam/${finalExamId}/attempt`}
        />
        <div className="box-theme">
          {questions.map((question) => {
            const correctOptions = question.course_final_exam_option_answers
              .filter((option) => option.is_correct)
              .map((option) => option.id);
            const userSelectedOptions = selectedAnswers[question.id] || [];
    
            // Calculate points obtained based on user selections
            let pointsObtained = 0;
    
            if (userSelectedOptions.length > 0) {
              const correctSelectedCount = userSelectedOptions.filter((optionId) =>
                correctOptions.includes(optionId)
              ).length;
    
              // Check if there are any incorrect selections
              const incorrectSelectionExists = userSelectedOptions.some((optionId) =>
                !correctOptions.includes(optionId)
              );
    
              if (incorrectSelectionExists) {
                pointsObtained = 0; // Set points to 0 if there are incorrect selections
              } else {
                // Calculate the proportional score based on correct selections
                if (correctOptions.length > 0) {
                  const proportionalFactor = 1 / correctOptions.length;
                  pointsObtained = proportionalFactor * question.points_assigned * correctSelectedCount;
                }
              }
            }
    
            pointsObtained = Math.max(pointsObtained, 0); // Ensure points don't go below 0
    
            return (
              <div key={question.id} className="p-4 bg-secondary rounded my-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xl font-semibold">{question.question_text}</p>
                  <p className="text-sm text-gray-400">
                    Puntos: {pointsObtained.toFixed(2)} / {question.points_assigned}
                  </p>
                </div>
                <div className="pl-4 mt-2 space-y-2">
                  {question.course_final_exam_option_answers.map((option) => {
                    const isSelected = selectedAnswers[question.id]?.includes(option.id);
                    const isCorrect = option.is_correct;
    
                    let bgColor = "bg-primary";
                    if (isSelected) {
                      bgColor = isCorrect ? "button-success-bg" : "button-danger-bg";
                    }
    
                    return (
                      <div
                        key={option.id}
                        className={`p-2 rounded ${bgColor}`}
                      >
                        <span>{option.answer_text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }
