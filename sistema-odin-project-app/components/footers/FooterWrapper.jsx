'use client';

import { usePathname } from 'next/navigation';

import BaseFooter from './BaseFooter';
import PlatformFooter from './platform/PlatformFooter';
import ControlCenterFooter from './control_center/ControlCenterFooter';

export default function FooterWrapper() {
  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes('/platform');
  const isControlCenterRoute = pathname && pathname.includes('/control_center');

  if (isPlatformRoute) {
    return <FooterPlataform/>
  } if (isControlCenterRoute) {
    return <FooterControlCenter/>
  } else {
    return <Footer />
  }

}

export function Footer() {
  const items = [
    { route: "#aboutUsSection", text: "Sobre nosotros" },
    { route: "#servicesSection", text: "Servicios" },
    { route: "#contactUsSection", text: "Contactanos" },
  ];

  return <BaseFooter items={items} />;
}

export function FooterPlataform() {
  const items = [
    { route: "#aboutUsSection", text: "Sobre nosotros" },
    { route: "#servicesSection", text: "Servicios" },
    { route: "#contactUsSection", text: "Contactanos" },
  ];

  return <PlatformFooter items={items} />;
}

export function FooterControlCenter() {
  const items = [
    { route: "#aboutUsSection", text: "Sobre nosotros" },
    { route: "#servicesSection", text: "Servicios" },
    { route: "#contactUsSection", text: "Contactanos" },
  ];

  return <ControlCenterFooter items={items} />;
}