'use client';

import { usePathname } from 'next/navigation';
import BaseNavBar from './BaseNavBar';
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import userPermissions from '@/contexts/permissionsConfig';
import { FiBarChart, FiBarChart2, FiBook, FiPieChart, FiSettings, FiUser } from 'react-icons/fi';
import Logo from '../Logo';
import { FaChartArea, FaChartLine, FaPencilAlt } from 'react-icons/fa';

export default function NavBarWrapper() {
  const { user } = useUserInfoContext();

  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes('/platform');

  return isPlatformRoute ? <NavBarPlataform user={user} /> : <NavBar />;
}

export function NavBar() {
  const mainMenu = [
    { id: 'home', route: '/', text: 'Inicio' },
    { id: "about_us", route: "#aboutUsSection", text: "Sobre nosotros" },
    { id: "our_services", route: "#servicesSection", text: "Servicios" },
    { id: "contact_us", route: "#contactUsSection", text: "Contactanos" },
  ];

  const toggleMenuItems = [
    { id: 'home', route: '/', text: 'Inicio' },
    { id: 'platform', route: '/platform', text: 'Plataforma' }
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
      Object.values(userPermissions).forEach(routes => {
        routes.forEach(({ group, route, name }) => {
          if (!subMenuItems.some(item => item.route === route)) {
            subMenuItems.push({ group, route, text: name });
          }
        });
      });
    } else {
      allowedPermissions.forEach(({ group, name, route }) => {
        if (!subMenuItems.some(item => item.route === route)) {
          subMenuItems.push({ group, route, text: name });
        }
      });
    }

    const filteredToggleMenuItems = [];

    const reportsSubMenu = subMenuItems.filter(item => item.group === 'reports');
    if (reportsSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'reports',
        route: '#',
        text: 'Reportes',
        icon: <FiPieChart/>,
        subMenu: reportsSubMenu
      });
    }

    const coursesSubMenu = subMenuItems.filter(item => item.group === 'courses');
    if (coursesSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'courses',
        route: '#',
        text: 'Cursos',
        icon: <FiBook/>,
        subMenu: coursesSubMenu
      });
    }

    const adminSubMenu = subMenuItems.filter(item => item.group === 'administration');
    if (adminSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'administration',
        route: '#',
        text: 'Administracion',
        icon: <FiSettings/>,
        subMenu: adminSubMenu,
      });
    }

    const usersSubMenu = subMenuItems.filter(item => item.group === 'users');
    if (usersSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'users',
        route: '#',
        text: 'Datos',
        icon: <FiUser/>,
        subMenu: usersSubMenu,
      });
    }

    const settingsSubMenu = subMenuItems.filter(item => item.group === 'settings');
    if (usersSubMenu.length > 0) {
      filteredToggleMenuItems.push({
        id: 'settings',
        route: '#',
        text: 'Ajustes',
        icon: <FiSettings/>,
        subMenu: settingsSubMenu,
      });
    }

    filteredToggleMenuItems.unshift(
      { id: 'home', route: '/', text: '', icon: <Logo/>, },
      { id: 'platform', route: '/platform', text: 'Inicio', icon: <FaPencilAlt/>, }
    );

    toggleMenuItems = filteredToggleMenuItems;
  }

  const loginInfo = { route: '/platform/login', text: 'Acceder a la plataforma' };

  return <BaseNavBar mainMenu={mainMenu} toggleMenuItems={toggleMenuItems} loginInfo={isLoggedIn ? null : loginInfo} />;
}
