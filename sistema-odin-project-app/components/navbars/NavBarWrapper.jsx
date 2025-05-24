"use client";

import { usePathname } from "next/navigation";
import BaseNavBar from "./BaseNavBar";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";
import userPermissions from "@/contexts/permissionsConfig";
import userPermissionsControlCenter from "@/contexts/permissionsControlCenterConfig";
import {
  FiBook,
  FiBookOpen,
  FiClipboard,
  FiPieChart,
  FiServer,
  FiSettings,
  FiUser,
} from "react-icons/fi";
import Logo from "../Logo";
import { FaBoxOpen, FaDolly, FaPencilAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getControlCenterUserBusinessEnabledPluggins } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";

export default function NavBarWrapper() {
  const { user } = useUserInfoContext();
  const { userControlCenter } = useUserControlCenterContext();

  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes("/platform");
  const isControlCenterRoute = pathname && pathname.includes("/control_center");

  if (isPlatformRoute) {
    return <NavBarPlataform user={user} />;
  }
  if (isControlCenterRoute) {
    return <NavBarControlCenter userControlCenter={userControlCenter} />;
  } else {
    return <NavBar />;
  }
}

export function NavBar() {
  const mainMenu = [
    { id: "home", route: "/", text: "Inicio" },
    { id: "about_us", route: "#aboutUsSection", text: "Sobre nosotros" },
    { id: "our_services", route: "#servicesSection", text: "Servicios" },
    { id: "contact_us", route: "#contactUsSection", text: "Contactanos" },
  ];

  const toggleMenuItems = [
    { id: "home", route: "/", text: "Inicio" },
    {
      id: "control_center",
      route: "/control_center",
      text: "Sistema de control",
    },
    { id: "platform", route: "/platform", text: "Campus virtual" },
  ];

  return <BaseNavBar mainMenu={mainMenu} toggleMenuItems={toggleMenuItems} />;
}

export function NavBarPlataform({ user }) {
  const isLoggedIn = !!user;
  const mainMenu = [];
  let toggleMenuItems = [];

  if (isLoggedIn) {
    const subMenuItems = [];

    const allowedPermissions = userPermissions[user.user_role_id] || [];

    // Get all routes if the user is root (user role 4)
    if (user.user_role_id === 4) {
      Object.values(userPermissions).forEach((routes) => {
        routes.forEach(({ group, route, name }) => {
          if (!subMenuItems.some((item) => item.route === route)) {
            subMenuItems.push({ group, route, text: name });
          }
        });
      });
    } else {
      allowedPermissions.forEach(({ group, name, route }) => {
        if (!subMenuItems.some((item) => item.route === route)) {
          subMenuItems.push({ group, route, text: name });
        }
      });
    }

    const filteredToggleMenuItems = [];

    const reportsSubMenu = subMenuItems.filter(
      (item) => item.group === "reports"
    );
    if (reportsSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "reports",
        route: "#",
        text: "Reportes",
        icon: <FiPieChart />,
        subMenu: reportsSubMenu,
      });
    }

    const coursesSubMenu = subMenuItems.filter(
      (item) => item.group === "courses"
    );
    if (coursesSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "courses",
        route: "#",
        text: "Cursos",
        icon: <FiBook />,
        subMenu: coursesSubMenu,
      });
    }

    const adminSubMenu = subMenuItems.filter(
      (item) => item.group === "administration"
    );
    if (adminSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "administration",
        route: "#",
        text: "Administracion",
        icon: <FiSettings />,
        subMenu: adminSubMenu,
      });
    }

    const usersSubMenu = subMenuItems.filter((item) => item.group === "users");
    if (usersSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "users",
        route: "#",
        text: "Datos",
        icon: <FiUser />,
        subMenu: usersSubMenu,
      });
    }

    const settingsSubMenu = subMenuItems.filter(
      (item) => item.group === "settings"
    );
    if (usersSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "settings",
        route: "#",
        text: "Ajustes",
        icon: <FiSettings />,
        subMenu: settingsSubMenu,
      });
    }

    filteredToggleMenuItems.unshift(
      { id: "home", route: "/", text: "", icon: <Logo /> },
      {
        id: "platform",
        route: "/platform",
        text: "Inicio",
        icon: <FaPencilAlt />,
      }
    );

    toggleMenuItems = filteredToggleMenuItems;
  }

  const loginInfo = {
    route: "/platform/login",
    text: "Acceder a la plataforma",
  };

  return (
    <BaseNavBar
      mainMenu={mainMenu}
      toggleMenuItems={toggleMenuItems}
      loginInfo={isLoggedIn ? null : loginInfo}
    />
  );
}

export function NavBarControlCenter({ userControlCenter }) {
  const [enabledPlugins, setEnabledPlugins] = useState([]);
  const isLoggedIn = !!userControlCenter;
  const mainMenu = [];
  let toggleMenuItems = [];

  useEffect(() => {
    const fetchEnabledPlugins = async () => {
      try {
        const plugins = await getControlCenterUserBusinessEnabledPluggins(
          userControlCenter.cc_user_business_id
        ); 
        setEnabledPlugins(plugins);
      } catch (error) {
        console.error("Error fetching enabled plugins:", error);
      }
    };

    if (userControlCenter) {
      fetchEnabledPlugins();
    }
  }, [userControlCenter]); 

  if (isLoggedIn) {
    const subMenuItems = [];

    const allowedPermissions =
      userPermissionsControlCenter[userControlCenter?.cc_user_role_id] || [];

    if (userControlCenter?.cc_user_role_id === 4) {
      Object.values(userPermissionsControlCenter).forEach((routes) => {
        routes.forEach(({ group, route, name }) => {
          if (!subMenuItems.some((item) => item.route === route)) {
            subMenuItems.push({ group, route, text: name });
          }
        });
      });
    } else {
      allowedPermissions.forEach(({ group, name, route, requiredPlugins }) => {
        if (
          (!requiredPlugins || enabledPlugins.includes(requiredPlugins)) &&
          !subMenuItems.some((item) => item.route === route)
        ) {
          subMenuItems.push({ group, route, text: name });
        }
      });
    }

    const filteredToggleMenuItems = [];

    const reportsSubMenu = subMenuItems.filter(
      (item) => item.group === "reports"
    );
    if (reportsSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "reports",
        route: "#",
        text: "Reportes",
        icon: <FiPieChart />,
        subMenu: reportsSubMenu,
      });
    }

    const adminSubMenu = subMenuItems.filter(
      (item) => item.group === "administration"
    );
    if (adminSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "administration",
        route: "#",
        text: "Administración",
        icon: <FiClipboard />,
        subMenu: adminSubMenu,
      });
    }

    const stockSubMenu = subMenuItems.filter(
      (item) => item.group === "stock"
    );
    if (stockSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "stock",
        route: "#",
        text: "Inventario",
        icon: <FaDolly   />,
        subMenu: stockSubMenu,
      });
    }

    const usersSubMenu = subMenuItems.filter((item) => item.group === "users");
    if (usersSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "users",
        route: "#",
        text: "Usuarios",
        icon: <FiUser />,
        subMenu: usersSubMenu,
      });
    }

    const settingsSubMenu = subMenuItems.filter(
      (item) => item.group === "settings"
    );
    if (settingsSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: "settings",
        route: "#",
        text: "Ajustes",
        icon: <FiSettings />,
        subMenu: settingsSubMenu,
      });
    }

    // Elementos predeterminados
    filteredToggleMenuItems.unshift(
      { id: "home", route: "/", text: "", icon: <Logo /> },
      {
        id: "control_center",
        route: "/control_center",
        text: "Inicio",
        icon: <FaPencilAlt />,
      }
    );

    toggleMenuItems = filteredToggleMenuItems;
  }

  const loginInfo = {
    route: "/control_center/login",
    text: "Acceder al centro de control",
  };

  return (
    <BaseNavBar
      mainMenu={mainMenu}
      toggleMenuItems={toggleMenuItems}
      loginInfo={isLoggedIn ? null : loginInfo}
    />
  );
}
