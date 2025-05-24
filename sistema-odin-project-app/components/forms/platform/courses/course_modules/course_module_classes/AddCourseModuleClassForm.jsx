"use client";


import { addCourseModuleClass } from "@/src/models/platform/course_module_class/course_module_class";
import { getCourseFormats } from "@/src/models/platform/course_format/course_format";
import { getCoursePlatformTools } from "@/src/models/platform/course_platform_tool/course_platform_tool";
import { getCourseModule } from "@/src/models/platform/course_module/courses_module";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import SelectInput from "@/components/forms/SelectInput";
import PageHeader from "@/components/page_formats/PageHeader";
import CheckboxWithInput from "@/components/forms/CheckboxWithInput";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddCourseModuleClassForm({ courseId, moduleId }) {
  const [formData, setFormData] = useState({
    title: "",
    course_format_id: "",
    course_platform_tool_id: "",
    description: "",
    video_link: "",
    has_video: false,
    has_link_to_drive: false,
    drive_link: "",
    time_to_complete: null
  });

  const [courseModuleTitle, setCourseModuleTitle] = useState("");
  const [formatsTable, setFormatsTable] = useState([]);
  const [toolsTable, setToolsTable] = useState([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  
  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        const courseModuleDetails = await getCourseModule(moduleId);
        setCourseModuleTitle(courseModuleDetails.title);

        const formats = await getCourseFormats();
        const tools = await getCoursePlatformTools();
        setFormatsTable(formats);
        setToolsTable(tools);
      } catch (error) {
        console.error(
          "Error al obtener datos de las tablas de herramientas y formatos:",
          error.message
        );
      }
    }
    fetchData();
  }, [courseId, moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      course_format_id,
      course_platform_tool_id,
      description,
      video_link,
      has_link_to_drive,
      drive_link,
      time_to_complete,
    } = formData;

    if (
      !title ||
      !time_to_complete ||
      !course_format_id ||
      !course_platform_tool_id ||
      (formData.has_video && !video_link) ||
      (formData.has_link_to_drive && !drive_link)
    ) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true); 

    try {
      await addCourseModuleClass(
        title,
        moduleId,
        course_format_id,
        description,
        formData.has_video,
        formData.has_video ? video_link : null,
        course_platform_tool_id,
        formData.has_link_to_drive,
        formData.has_link_to_drive ? drive_link : null,
        time_to_complete
      );

      showNotification("¡Clase agregada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/courses/${courseId}`);
      }, 2000);

    } catch (error) {
      console.error("Error al agregar clase:", error.message);
      setIsLoading(false); 
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData({
      ...formData,
      [name]: newValue,
    });
  };

  return (
    <>
      <PageHeader
        title={courseModuleTitle || "Cargando..."}
        goBackRoute={`/platform/courses/${courseId}`}
        goBackText="Volver a detalles del curso"
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Título"
          name="title"
          value={formData.title}
          required={true}
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <Input
          label="Descripción"
          name="description"
          value={formData.description}
          placeholder=""
          onChange={handleChange}
        />

        <SelectInput
          label="Formato"
          name="course_format_id"
          value={formData.course_format_id}
          required={true}
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={formatsTable}
          columnName="name"
          idColumn="id"
        />

        <SelectInput
          label="Herramienta de Plataforma"
          name="course_platform_tool_id"
          value={formData.course_platform_tool_id}
          required={true}
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={toolsTable}
          columnName="name"
          idColumn="id"
        />

        <Input
          label="Tiempo estimado para completar la clase"
          type="number"
          name="time_to_complete"
          value={formData.time_to_complete}
          required={true}
          placeholder="Minutos estimados de la clase"
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <CheckboxWithInput
          checkboxId="has_video"
          checkboxChecked={formData.has_video}
          checkboxOnChange={handleChange}
          checkboxName="has_video"
          checkboxLabel="¿Contiene video?"
          inputName="video_link"
          inputValue={formData.video_link}
          inputLabel="Enlace del Video de YouTube"
          inputPlaceholder="Ingrese el identificador de video de YouTube"
          inputOnChange={handleChange}
          isSubmitted={isSubmitted}
          inputErrorMessage="Campo obligatorio"
        />

        <CheckboxWithInput
          checkboxId="has_link_to_drive"
          checkboxChecked={formData.has_link_to_drive}
          checkboxOnChange={handleChange}
          checkboxName="has_link_to_drive"
          checkboxLabel="¿Tiene enlace a Google Drive?"
          inputName="drive_link"
          inputValue={formData.drive_link}
          inputLabel="Enlace a Google Drive"
          inputPlaceholder="Ingrese el enlace de Google Drive"
          inputOnChange={handleChange}
          isSubmitted={isSubmitted}
          inputErrorMessage="Campo obligatorio"
        />
        
        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar Clase
        </SubmitLoadingButton>
      </form>
    </>
  );
}
