"use client";

import {
  getCourseModule,
  editCourseModule,
} from "@/src/controllers/platform/course_module/courses_module";
import { getCourse } from "@/src/controllers/platform/course/course";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import TextArea from "@/components/forms/TextArea";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function EditCourseModuleForm({ courseId, moduleId }) {
  const [courseModule, setCourseModule] = useState({
    title: "",
    description: ""
  });
  const [courseName, setCourseName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const courseDetails = await getCourse(courseId);
        setCourseName(courseDetails.name);

        const fetchedCourseModule = await getCourseModule(moduleId);
        setCourseModule(fetchedCourseModule);
      } catch (error) {
        console.error("Error al obtener el curso:", error.message);
      }
    };
    fetchCourseDetails();
  }, [courseId, moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!courseModule.title) {
      return;
    }

    setIsLoading(true); 

    try {
      await editCourseModule(moduleId, courseModule.title, courseModule.description);
      showNotification("¡Módulo editado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}`);
      }, 2000);
    } catch (error) {
      console.error("Error al editar el módulo:", error.message);
      setIsLoading(false); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseModule({ ...courseModule, [name]: value });
  };

  return (
    <>
      <PageHeader
        title={courseName || "Cargando..."}
        subtitle="Editar módulo"
        goBackRoute={`/platform/courses/${courseId}`}
        goBackText="Volver al listado de módulos"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Título"
          name="title"
          value={courseModule.title}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripción"
          name="description"
          value={courseModule.description}
          placeholder="Escribe una breve descripcion del módulo aquí..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          hasHightlightTexts={true}
        />

        <SubmitLoadingButton type="submit" isLoading={isLoading}>
          Editar Módulo
        </SubmitLoadingButton>
      </form>
    </>
  );
}