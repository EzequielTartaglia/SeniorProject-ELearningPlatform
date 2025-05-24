"use client";

import { getCourseFinalExam } from "@/src/controllers/platform/course_final_exam/course_final_exam";
import { getCourse } from "@/src/controllers/platform/course/course";
import { getFinalExamQuestionsAndOptions } from "@/src/controllers/platform/course_final_exam_option_answer/course_final_exam_option_answer";
import { checkStudentCourseEnrollment } from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment";
import {
  checkStudentCourseEnrollmentFinalExamAttempt,
  checkExpirationDate,
} from "@/src/controllers/platform/student_course_enrollment_final_exam_attempt/student_course_enrollment_final_exam_attempt";
import { getStudentCourseEnrollmentFinalExamAttemptTriesFromEnrollment } from "@/src/controllers/platform/student_course_enrollment_final_exam_attempt_try/student_course_enrollment_final_exam_attempt_try";

import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";
import formatDate from "@/src/helpers/formatDate";

import PageHeader from "@/components/page_formats/PageHeader";
import ExamDetailCard from "../Course[id]FinalExamManagePage/ExamDetailCard";
import Button from "@/components/Button";
import ScoreCard from "./ScoreCard";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function CourseFinalExamAttemptPage({ courseId, finalExamId }) {
  const [examDetails, setExamDetails] = useState({
    finalExamDetails: null,
    courseDetails: null,
    finalExamQuestionsWithAnswers: [],
    enrollmentDetails: null,
    attemptId: null,
    enrollmentTriesDetails: [],
    totalPoints: 0,
    totalAttempts: 0,
    totalAttemptsPerPeriod: 0,
    nextActivationDate: null,
    bestScore: 0,
    isApproved: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useUserInfoContext();

  useEffect(() => {
    async function fetchData() {
      try {
        //Reset expiration dates
        await checkExpirationDate();

        const courseDetails = await getCourse(courseId);
        const enrollment = await checkStudentCourseEnrollment(
          user.id,
          courseId
        );
        if (!enrollment) {
          throw new Error("No estas inscripto a este curso.");
        }

        const finalExamDetails = await getCourseFinalExam(courseId);
        const finalExamQuestionsWithAnswersDetail =
          await getFinalExamQuestionsAndOptions(finalExamDetails.id);

        const totalPoints = finalExamQuestionsWithAnswersDetail.reduce(
          (acc, question) => acc + question.points_assigned,
          0
        );

        const attempt = await checkStudentCourseEnrollmentFinalExamAttempt(
          enrollment.id
        );
        const totalAttempts = attempt ? attempt.total_attempts : 0;
        const totalAttemptsPerPeriod = attempt
          ? attempt.attempts_count_period
          : 0;
        const bestScore = attempt ? attempt.best_score : 0;
        const nextActivationDate =
        attempt?.lock_expiration_date && !isNaN(new Date(attempt.lock_expiration_date).getTime())
          ? new Date(attempt.lock_expiration_date).toISOString().split("T")[0] 
          : null;
      
        const isApproved = attempt ? attempt.is_approved : null;

        const enrollmentTriesDetails = attempt
          ? await getStudentCourseEnrollmentFinalExamAttemptTriesFromEnrollment(
              attempt.id
            )
          : [];

        setExamDetails({
          finalExamDetails,
          courseDetails,
          finalExamQuestionsWithAnswers: finalExamQuestionsWithAnswersDetail,
          enrollmentDetails: enrollment,
          attemptId: attempt ? attempt.id : null,
          enrollmentTriesDetails,
          totalPoints,
          totalAttempts,
          totalAttemptsPerPeriod,
          nextActivationDate,
          bestScore,
          isApproved,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [courseId, user.id]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p>Error: {error}</p>;

  const percentScore =
    examDetails.totalPoints > 0
      ? ((examDetails.bestScore / examDetails.totalPoints) * 100).toFixed(0)
      : 0;

  return (
    <>
      {examDetails.finalExamDetails && examDetails.enrollmentDetails ? (
        <>
          <PageHeader
            title={examDetails.courseDetails.name}
            subtitle={"Examen Final"}
            goBackText={"Volver a detalles del curso"}
            goBackRoute={`/platform/courses/${courseId}`}
          />

          <ExamDetailCard
            title={examDetails.finalExamDetails.title}
            description={examDetails.finalExamDetails.description}
            minScore={examDetails.finalExamDetails.min_score_to_pass}
            questionsCount={examDetails.finalExamQuestionsWithAnswers.length}
            totalPoints={examDetails.totalPoints}
            hasEdit={false}
          />

          <ScoreCard
            status={examDetails.isApproved}
            totalAttempts={examDetails.totalAttempts}
            bestScore={examDetails.bestScore}
            maxScore={examDetails.totalPoints}
            percentScore={percentScore}
            items={examDetails.enrollmentTriesDetails}
            attemptsTriedThisPeriod={examDetails.totalAttemptsPerPeriod}
            nextActivationDate={formatDate(examDetails.nextActivationDate)}
            buttonShowRoute={(attempt_try) =>
              `/platform/courses/${courseId}/final_exam/${finalExamId}/attempt/${examDetails.attemptId}/try/${attempt_try}`
            }
          />

          {!examDetails.isApproved && (
            <div className="mt-4">
              <Button
                route={`/platform/courses/${courseId}/final_exam/${finalExamId}/attempt/${examDetails.attemptId}/new`}
                text={
                  examDetails.totalAttemptsPerPeriod === 3
                    ? "Intentos agotados por periodo"
                    : examDetails.totalAttemptsPerPeriod === 0
                    ? "Realizar examen"
                    : "Realizar otro intento"
                }
                customClasses={`rounded-md ${
                  examDetails.totalAttemptsPerPeriod === 3
                    ? "bg-gray-500 text-primary"
                    : "bg-primary border-secondary-light text-title-active-static bg-dark-mode"
                } `}
                disabled={examDetails.totalAttemptsPerPeriod === 3}
                isAnimated={examDetails.totalAttemptsPerPeriod !== 3}
              />
            </div>
          )}
        </>
      ) : (
        <p className="text-primary">No estas inscripto a este curso.</p>
      )}
    </>
  );
}
