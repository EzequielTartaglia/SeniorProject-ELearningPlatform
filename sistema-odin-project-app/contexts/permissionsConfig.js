import { FaChartArea } from "react-icons/fa";
import { FiBarChart, FiHome, FiSettings, FiUser } from "react-icons/fi";

const sharedPermissions = [
  {
    group: "courses",
    name: "Cursos",
    route: "/platform/courses",
    icon: FiHome,
  },
];

const userPermissions = {
  // Profesor
  1: [...sharedPermissions],
  // Student
  2: [...sharedPermissions],
  // Administrator (empresa)
  3: [
    ...sharedPermissions,
    {
      group: "reports",
      name: "Reportes (inscripciones)",
      route: "/platform/dashboard/course_enrollments",
      icon: FaChartArea,
    },
    {
      group: "administration",
      name: "Inscripciones",
      route: "/platform/admin/course_enrollment_states",
      icon: FiSettings,
    },
    {
      group: "courses",
      name: "Formatos",
      route: "/platform/course_formats",
      icon: FiSettings,
    },
    {
      group: "courses",
      name: "Herramientas",
      route: "/platform/course_platform_tools",
      icon: FiSettings,
    },
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
    {
      group: "settings",
      name: "Ajustes",
      route: "/platform/platform_settings",
      icon: FiSettings,
    },
  ],
  // Root
  4: [], // Access to all routes
  // Administrator (empresas)
  5: [
    ...sharedPermissions,
    {
      group: "reports",
      name: "Reportes (inscripciones)",
      route: "/platform/dashboard/course_enrollments",
      icon: FaChartArea,
    },
    {
      group: "administration",
      name: "Inscripciones",
      route: "/platform/admin/course_enrollment_states",
      icon: FiSettings,
    },
    {
      group: "courses",
      name: "Formatos",
      route: "/platform/course_formats",
      icon: FiSettings,
    },
    {
      group: "courses",
      name: "Herramientas",
      route: "/platform/course_platform_tools",
      icon: FiSettings,
    },
    {
      group: "users",
      name: "Usuarios",
      route: "/platform/users",
      icon: FiUser,
    },
    {
      group: "users",
      name: "Empresas en sistema",
      route: "/platform/platform_user_businesses",
      icon: FiUser,
    },
    {
      group: "settings",
      name: "Ajustes",
      route: "/platform/platform_settings",
      icon: FiSettings,
    },
  ],
};

export default userPermissions;
