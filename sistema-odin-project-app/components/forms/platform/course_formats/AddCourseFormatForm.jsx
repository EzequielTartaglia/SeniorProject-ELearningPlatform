"use client";

import { addCourseFormat } from "@/src/models/platform/course_format/course_format";

import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";

export default function AddCourseFormatForm() {
  const [courseFormat, setCourseFormat] = useState({
    name: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!courseFormat.name) {
      return;
    }

    setIsLoading(true);

    try {
      await addCourseFormat(courseFormat.name);

      showNotification("¡Formato agregado exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/course_formats`);
      }, 2000);

    } catch (error) {
      console.error("Error al agregar el formato para cursos:", error.message);
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
        title="Nuevo formato"
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
          Agregar formato para cursos
        </SubmitLoadingButton>
      </form>
    </>
  );
}
