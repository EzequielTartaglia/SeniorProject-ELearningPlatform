"use client";

import {
  getCoursePlatformTools,
  deleteCoursePlatformTool,
} from "@/src/controllers/platform/course_platform_tool/course_platform_tool";

import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";

export default function CoursesPlatformToolsPage() {
  const { user } = useUserInfoContext();

  const [coursesPlatformToolsNames, setCoursesPlatformToolsNames] = useState(
    []
  );

  const [filteredPlatformToolsNames, setFilteredPlatformToolsNames] = useState(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchCoursesPlatformToolsNames() {
      try {
        const names = await getCoursePlatformTools();
        setCoursesPlatformToolsNames(names);
        setFilteredPlatformToolsNames(names);
      } catch (error) {
        console.error(
          "Error al obtener los nombres de las herramientas:",
          error.message
        );
      }
    }
    fetchCoursesPlatformToolsNames();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredPlatformToolsNames(coursesPlatformToolsNames);
    } else {
      setFilteredPlatformToolsNames(
        coursesPlatformToolsNames.filter((course_platform_tool) =>
          course_platform_tool.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [coursesPlatformToolsNames, searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDeleteCoursePlatformTool = async (id) => {
    try {
      await deleteCoursePlatformTool(id);
      setCoursesPlatformToolsNames((prevNames) =>
        prevNames.filter(
          (courses_platform_tool) => courses_platform_tool.id !== id
        )
      );
      showNotification("¡Herramienta eliminada exitosamente!", "info");
    } catch (error) {
      console.error("Error al eliminar la herramienta:", error.message);
    }
  };

  return (
    <>
      <PageHeader
        title={"Herramientas"}
        goBackRoute={`/platform/courses`}
        goBackText={"Volver al listado de cursos"}
      />

      <SearchInput
        placeholder="Buscar herramientas..."
        value={searchTerm}  // Cambiado a searchTerm
        onChange={handleSearchChange}  // No cambió
      />

      <ListWithTitle
        title=""
        items={filteredPlatformToolsNames}
        hasAdd={user.user_role_id === 3 || user.user_role_id === 4}
        buttonAddRoute={
          user.user_role_id === 3 || user.user_role_id === 4
            ? `/platform/course_platform_tools/new`
            : null
        }
        hasShow={(id) => null}
        buttonShowRoute={(id) => `/platform/course_platform_tools/${id}`}
        hasEdit={user.user_role_id === 3 || user.user_role_id === 4}
        buttonEditRoute={(id) =>
          user.user_role_id === 3 || user.user_role_id === 4
            ? `/platform/course_platform_tools/${id}/edit`
            : null
        }
        hasDelete={user.user_role_id === 3 || user.user_role_id === 4}
        buttonDeleteRoute={handleDeleteCoursePlatformTool}
        columnName="name"
        confirmModalText="¿Estás seguro de que deseas eliminar esta herramienta?"
      />
    </>
  );
}
