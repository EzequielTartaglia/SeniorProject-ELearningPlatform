"use client";

import { getCoursePlatformTool, editCoursePlatformTool } from "@/src/models/platform/course_platform_tool/course_platform_tool";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "../../SubmitLoadingButton";

export default function EditCoursePlatformToolForm({ coursePlatformToolId }) {
  const [coursePlatformTool, setCoursePlatformTool] = useState({
    id: "",
    name: "",
    link: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchCoursePlatformTool = async () => {
      try {
        const fetchedCoursePlatformTool = await getCoursePlatformTool(
          coursePlatformToolId
        );
        setCoursePlatformTool(fetchedCoursePlatformTool);
      } catch (error) {
        console.error(
          "Error al obtener las herramientas:",
          error.message
        );
      }
    };
    fetchCoursePlatformTool();
  }, [coursePlatformToolId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    if (!coursePlatformTool.name || !coursePlatformTool.link) {
      return;
    }
    setIsLoading(true); 

    try {
      await editCoursePlatformTool(
        coursePlatformToolId,
        coursePlatformTool.name,
        coursePlatformTool.link
      );

      
      showNotification("¡Herramienta editada exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/course_platform_tools`);
      }, 2000);

    } catch (error) {
      console.error("Error al editar el curso:", error.message);
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
        title="Editar herramienta"
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
          Editar herramienta
        </SubmitLoadingButton>
      </form>
    </>
  );
}
