"use client";

import { getCourses } from "@/src/controllers/platform/course/course";
import { getEnrollmentCountsByCourse } from "@/src/controllers/platform/student_course_enrollment/student_course_enrollment_insights";

import { useEffect, useState } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import EnrollmentBarChart from "@/src/views/Platform/Dashboard/EnrollmentBarChart";
import CourseRevenueChart from "./CourseRevenueChart";
import GenderPieChartTotalEnrollments from "./GenderPieChartTotalEnrollments";
import AgePieChartTotalEnrollments from "./AgePieChartTotalEnrollments";
import CountryPieChartTotalEnrollments from "./CountryPieChartTotalEnrollments";
import AgePieChartEnrollmentsByCourse from "./AgePieChartEnrollmentsByCourse";
import GenderPieChartEnrollmentsByCourse from "./GenderPieChartEnrollmentsByCourse";
import CountryPieChartEnrollmentsByCourse from "./CountryPieChartEnrollmentsByCourse";
import EnrollmentDateBarChart from "./EnrollmentDateBarChart";
import EnrollmentDateByCourseBarChart from "./EnrollmentDateByCourseBarChart";

export default function DashboardPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [enrollmentsDate, setEnrollmentsDate] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChart, setActiveChart] = useState("generalCounts");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const allEnrollments = await getEnrollmentCountsByCourse();
        const enrollmentCounts = allEnrollments.reduce((acc, enrollment) => {
          const {
            course_id,
            payment,
            currency_abbreviation,
            enrollment_date,
            platform_user_gender_name,
            platform_user_country_name,
            birthdate,
            age,
          } = enrollment;

          const key = `${course_id}_${currency_abbreviation}`;
          if (!acc[key]) {
            acc[key] = {
              total_payments: 0,
              total_enrollments: 0,
              course_id,
              currency_abbreviation,
              enrollment_date,
              enrollment_dates: [],
              genders: {},
              countries: {},
              birthdates: [],
              ages: [],
            };
          }

          // Acumulamos el pago y las inscripciones
          acc[key].total_payments += parseFloat(payment) || 0;
          acc[key].total_enrollments += 1;

          // Acumulamos inscripciones por género
          const genderName = platform_user_gender_name || "Desconocido";
          if (!acc[key].genders[genderName]) {
            acc[key].genders[genderName] = 0;
          }
          acc[key].genders[genderName] += 1;

          // Acumulamos inscripciones por pais
          const countryName = platform_user_country_name || "Desconocido";
          if (!acc[key].countries[countryName]) {
            acc[key].countries[countryName] = 0;
          }
          acc[key].countries[countryName] += 1;

          // Acumulamos las fechas de inscripción
          const enrollmentDate = enrollment.enrollment_date || "Desconocido";
          if (!acc[key].enrollment_dates[enrollmentDate]) {
            acc[key].enrollment_dates.push(enrollment_date);
          }

          // Acumulamos las fechas de nacimiento
          if (birthdate) {
            acc[key].birthdates.push(birthdate);
            acc[key].ages.push(age);
          }

          return acc;
        }, {});

        const formattedData = Object.values(enrollmentCounts);

        setEnrollments(formattedData);

        const courseData = await getCourses();
        setCourses(courseData);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <PageHeader
        title="Reportes (inscripciones)"
        goBackRoute={`/platform/`}
        goBackText="Volver al inicio"
      />
      <div className="max-w-[100%]">
        <div className="flex flex-col w-full md:flex-row justify-center md:space-x-4 space-y-2 md:space-y-0 mb-4">
          <Button
            customClasses={`w-full md:w-auto px-4 py-2 ${
              activeChart === "generalCounts"
                ? "body-bg text-white border-primary-light-main"
                : "bg-dark-mode text-title-active-static border-secondary-light"
            }  rounded-md shadow-md transition duration-300 font-semibold`}
            customFunction={() => setActiveChart("generalCounts")}
            text={"Recuento general"}
          />

          <Button
            customClasses={`w-full md:w-auto px-4 py-2 ${
              activeChart === "revenue"
                ? "body-bg text-white border-primary-light-main"
                : "bg-dark-mode text-title-active-static border-secondary-light"
            } rounded-md shadow-md transition duration-300 font-semibold`}
            customFunction={() => setActiveChart("revenue")}
            text={"Ganancias"}
          />

          <Button
            customClasses={`w-full md:w-auto px-4 py-2 ${
              activeChart === "genderByCourse"
                ? "body-bg text-white border-primary-light-main"
                : "bg-dark-mode text-title-active-static border-secondary-light"
            }  rounded-md shadow-md transition duration-300 font-semibold`}
            customFunction={() => setActiveChart("genderByCourse")}
            text={"Género de usuarios (Curso)"}
          />

          <Button
            customClasses={`w-full md:w-auto px-4 py-2 ${
              activeChart === "ageByCourse"
                ? "body-bg text-white border-primary-light-main"
                : "bg-dark-mode text-title-active-static border-secondary-light"
            }  rounded-md shadow-md transition duration-300 font-semibold`}
            customFunction={() => setActiveChart("ageByCourse")}
            text={"Edad de usuarios (Curso)"}
          />

          <Button
            customClasses={`w-full md:w-auto px-4 py-2 ${
              activeChart === "countryByCourse"
                ? "body-bg text-white border-primary-light-main"
                : "bg-dark-mode text-title-active-static border-secondary-light"
            }  rounded-md shadow-md transition duration-300 font-semibold`}
            customFunction={() => setActiveChart("countryByCourse")}
            text={"Pais de usuarios (Curso)"}
          />

          <Button
            customClasses={`w-full md:w-auto px-4 py-2 ${
              activeChart === "enrollmentDateByCourse"
                ? "body-bg text-white border-primary-light-main"
                : "bg-dark-mode text-title-active-static border-secondary-light"
            }  rounded-md shadow-md transition duration-300 font-semibold`}
            customFunction={() => setActiveChart("enrollmentDateByCourse")}
            text={"Fecha de inscripcion (Curso)"}
          />
        </div>

        {activeChart === "generalCounts" && (
          <>
            <div className="box-theme w-full h-[650px] md:h-[650px]">
              <EnrollmentBarChart enrollments={enrollments} courses={courses} />
            </div>
            <div className="box-theme w-full h-auto md:h-auto">
              <EnrollmentDateBarChart />
            </div>
            <div className="box-theme w-full h-[550px] md:h-[525px]">
              <GenderPieChartTotalEnrollments enrollments={enrollments} />
            </div>
            <div className="box-theme w-full h-auto md:h-auto">
              <CountryPieChartTotalEnrollments enrollments={enrollments} />
            </div>
            <div className="box-theme w-full h-auto md:h-auto">
              <AgePieChartTotalEnrollments enrollments={enrollments} />
            </div>
          </>
        )}

        {activeChart === "revenue" && (
          <div className="box-theme w-full h-[650px] md:h-[650px]">
            <CourseRevenueChart enrollments={enrollments} courses={courses} />
          </div>
        )}

        {activeChart === "genderByCourse" && (
          <div className="box-theme w-full h-auto md:h-auto">
            <GenderPieChartEnrollmentsByCourse
              enrollments={enrollments}
              courses={courses}
            />
          </div>
        )}

        {activeChart === "ageByCourse" && (
          <div className="box-theme w-full h-auto md:h-auto">
            <AgePieChartEnrollmentsByCourse
              enrollments={enrollments}
              courses={courses}
            />
          </div>
        )}

        {activeChart === "countryByCourse" && (
          <div className="box-theme w-full h-auto md:h-auto">
            <CountryPieChartEnrollmentsByCourse
              enrollments={enrollments}
              courses={courses}
            />
          </div>
        )}

        {activeChart === "enrollmentDateByCourse" && (
          <div className="box-theme w-full h-auto md:h-auto">
            <EnrollmentDateByCourseBarChart courses={courses} />
          </div>
        )}
      </div>
    </>
  );
}
