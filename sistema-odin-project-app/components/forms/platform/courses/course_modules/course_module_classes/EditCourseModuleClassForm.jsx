"use client";

import {
  getCourseModuleClassSingle,
  editCourseModuleClass,
} from "@/src/models/platform/course_module_class/course_module_class";
import { getCourseFormats } from "@/src/models/platform/course_format/course_format";
import { getCoursePlatformTools } from "@/src/models/platform/course_platform_tool/course_platform_tool";
import { getCourseModule } from "@/src/models/platform/course_module/courses_module";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import Input from "@/components/forms/Input";
import SelectInput from "@/components/forms/SelectInput";
import PageHeader from "@/components/page_formats/PageHeader";
import CheckboxWithInput from "@/components/forms/CheckboxWithInput";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function EditCourseModuleClassForm({
  courseId,
  moduleId,
  classId,
}) {
  const [formData, setFormData] = useState({
    title: "",
    course_format_id: "",
    course_platform_tool_id: "",
    description: "",
    video_link: "",
    has_video: false,
    has_link_to_drive: false,
    drive_link: "",
    time_to_complete: null,
  });

  const [courseModuleTitle, setCourseModuleTitle] = useState("");
  const [formatsTable, setFormatsTable] = useState([]);
  const [toolsTable, setToolsTable] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 

  const [hasVideo, setHasVideo] = useState(false);
  const [hasDriveLink, setHasDriveLink] = useState(false);

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

        const classData = await getCourseModuleClassSingle(classId);
        setFormData({
          title: classData.title,
          course_format_id: classData.course_format_id,
          course_platform_tool_id: classData.course_platform_tool_id,
          description: classData.description,
          video_link: classData.video_link,
          has_video: classData.has_video,
          has_link_to_drive: classData.has_link_to_drive,
          drive_link: classData.drive_link,
          time_to_complete: classData.time_to_complete,
        });
        setHasVideo(classData.has_video);
        setHasDriveLink(classData.has_link_to_drive);
      } catch (error) {
        console.error(
          "Error al obtener datos de las tablas de herramientas y formatos:",
          error.message
        );
      }
    }
    fetchData();
  }, [classId, moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      title,
      course_format_id,
      course_platform_tool_id,
      description,
      video_link,
      drive_link,
      time_to_complete,
    } = formData;

    if (
      !title ||
      !time_to_complete ||
      !course_format_id ||
      !course_platform_tool_id ||
      (hasVideo && !video_link) ||
      (hasDriveLink && !drive_link)
    ) {
      setIsSubmitted(true);
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true); 

    try {
      await editCourseModuleClass(
        classId,
        title,
        moduleId,
        course_format_id,
        description,
        hasVideo,
        hasVideo ? video_link : null,
        course_platform_tool_id,
        hasDriveLink,
        hasDriveLink ? drive_link : null,
        time_to_complete
      );

      showNotification("¡Clase editada exitosamente!", "success");

      router.push(`/platform/courses/${courseId}`);
    } catch (error) {
      console.error("Error al editar clase:", error.message);
      setIsLoading(false); 
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <>
      <PageHeader
        title={courseModuleTitle || "Cargando..."}
        subtitle={"Editar clase"}
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
          placeholder=""
          onChange={handleChange}
          isSubmitted={isSubmitted}
          errorMessage={
            isSubmitted && !formData.title ? "Campo obligatorio" : ""
          }
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
          errorMessage={
            isSubmitted && !formData.course_format_id ? "Campo obligatorio" : ""
          }
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
          errorMessage={
            isSubmitted && !formData.course_platform_tool_id
              ? "Campo obligatorio"
              : ""
          }
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
          checkboxChecked={hasVideo}
          checkboxOnChange={(e) => setHasVideo(e.target.checked)}
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
          checkboxChecked={hasDriveLink}
          checkboxOnChange={(e) => setHasDriveLink(e.target.checked)}
          checkboxLabel="¿Tiene enlace a Google Drive?"
          inputName="drive_link"
          inputValue={formData.drive_link}
          inputLabel="Enlace de Google Drive"
          inputPlaceholder="Ingrese el enlace de Google Drive"
          inputOnChange={handleChange}
          isSubmitted={isSubmitted}
          inputErrorMessage="Campo obligatorio"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar Clase
        </SubmitLoadingButton>
      </form>
    </>
  );
}
