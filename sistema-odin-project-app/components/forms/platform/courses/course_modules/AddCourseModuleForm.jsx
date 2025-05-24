"use client";

import { addCourseModule } from "@/src/models/platform/course_module/courses_module";
import { getCourse } from "@/src/models/platform/course/course";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";

export default function AddCourseModuleForm({ courseId }) {
  const [courseName, setCourseName] = useState("");
  const [courseModule, setCourseModule] = useState({
    title: "",
    description: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseName = async () => {
      try {
        const courseDetails = await getCourse(courseId);
        setCourseName(courseDetails.name);
      } catch (error) {
        console.error("Error al obtener el nombre del curso:", error.message);
      }
    };

    fetchCourseName();
  }, [courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseModule((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!courseModule.title) {
      return;
    }

    setIsLoading(true);

    try {
      await addCourseModule(courseModule.title, courseModule.description, courseId);
      showNotification("¡Módulo agregado exitosamente!", "success");

      setTimeout(() => {
        router.push(`/platform/courses/${courseId}`);
        setIsLoading(false);
      }, 2000);
    } catch (error) {
      console.error("Error al agregar módulo:", error.message);
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title={courseName || "Cargando..."}
        goBackRoute={`/platform/courses/${courseId}`}
        goBackText="Volver a detalles del curso"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Título"
          name="title"
          value={courseModule.title}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripción"
          name="description"
          value={courseModule.description}
          placeholder="Escribe una breve descripcion del modulo aqui..."
          onChange={handleChange}
          isSubmitted={isSubmitted}
          hasHightlightTexts={true}
        />

        <SubmitLoadingButton type="submit" isLoading={isLoading}>
          Agregar Módulo
        </SubmitLoadingButton>
      </form>
    </>
  );
}
