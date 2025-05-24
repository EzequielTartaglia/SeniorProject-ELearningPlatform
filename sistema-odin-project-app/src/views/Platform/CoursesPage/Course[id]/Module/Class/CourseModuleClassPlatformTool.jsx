'use client';

import { getCourseModuleClassPlatformTool } from "@/src/models/platform/course_platform_tool/course_platform_tool";
import { useEffect, useState } from "react";

export default function CourseModuleClassPlatformTool({ courseModuleClassPlatformToolId, className }) {
    const [platformName, setPlatformName] = useState(null);

    useEffect(() => {
        async function fetchPlatformToolName() {
            try {
                const name = await getCourseModuleClassPlatformTool(courseModuleClassPlatformToolId);
                setPlatformName(name);
            } catch (error) {
                console.error("Error al obtener el nombre de la herramienta:", error.message);
            }
        }

        fetchPlatformToolName();
    }, [courseModuleClassPlatformToolId]);

    return (
        <span className={className}>{platformName || 'Cargando...'}</span>
    );
}