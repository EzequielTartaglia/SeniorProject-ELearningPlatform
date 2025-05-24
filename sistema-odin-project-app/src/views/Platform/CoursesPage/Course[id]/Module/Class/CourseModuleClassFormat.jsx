'use client'

import { getCourseModuleClassFormat } from "@/src/models/platform/course_module_class/course_module_class";
import { useEffect, useState } from "react";

export default function CourseModuleClassFormat({ courseModuleClassFormatId, className }) {
    const [formatName, setFormatName] = useState(null);

    useEffect(() => {
        async function fetchFormatName() {
            try {
                const name = await getCourseModuleClassFormat(courseModuleClassFormatId);
                setFormatName(name);
            } catch (error) {
                console.error("Error al obtener el nombre del formato:", error.message);
            }
        }

        fetchFormatName();
    }, [courseModuleClassFormatId]);

    return (
        <span className={className}>{formatName || 'Cargando...'}</span>
    );
}
