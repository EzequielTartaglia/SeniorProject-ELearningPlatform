"use client";

import { addCoursePlatformTool } from "@/src/models/platform/course_platform_tool/course_platform_tool";

import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";

export default function AddCoursePlatformToolForm() {
  const [coursePlatformTool, setCoursePlatformTool] = useState({
    name: "",
    link: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!coursePlatformTool.name || !coursePlatformTool.link) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true);

    try {
      await addCoursePlatformTool(
        coursePlatformTool.name,
        coursePlatformTool.link
      );

      showNotification("¡Herramienta agregada exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/course_platform_tools`);
      }, 2000);

    } catch (error) {
      console.error("Error al agregar la herramienta:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCoursePlatformTool({ ...coursePlatformTool, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Nueva herramienta"
        goBackRoute="/platform/course_platform_tools"
        goBackText={"Volver al listado de herramientas"}
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Nombre"
          name="name"
          value={coursePlatformTool.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />
        <Input
          label="Enlace"
          name="link"
          value={coursePlatformTool.link}
          required={true}
          placeholder="http://www.example.com"
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />
        <SubmitLoadingButton isLoading={isLoading} type="submit"> 
          Agregar herramienta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
