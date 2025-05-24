"use client";

import {
  getCourseFormat,
  editCourseFormat,
} from "@/src/models/platform/course_format/course_format";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";

export default function EditCourseFormatForm({ courseFormatId }) {
  const [courseFormat, setCourseFormat] = useState({
    id: "",
    name: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCourseFormat = async () => {
      try {
        const fetchedCourseFormat = await getCourseFormat(courseFormatId);
        setCourseFormat(fetchedCourseFormat);
      } catch (error) {
        console.error("Error al obtener los formatos:", error.message);
      }
    };
    fetchCourseFormat();
  }, [courseFormatId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!courseFormat.name) {
      return;
    }

    setIsLoading(true); 

    try {
      await editCourseFormat(courseFormatId, courseFormat.name);

      showNotification("¡Formato editado exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/course_formats`);
      }, 2000);

    } catch (error) {
      console.error("Error al editar el formato:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseFormat({ ...courseFormat, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Editar formato"
        goBackRoute="/platform/course_formats"
        goBackText="Volver al listado de formatos para cursos"
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Nombre"
          name="name"
          value={courseFormat.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit"> 
          Editar formato
        </SubmitLoadingButton>
      </form>
    </>
  );
}
