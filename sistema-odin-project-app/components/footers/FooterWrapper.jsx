'use client';

import { usePathname } from 'next/navigation';

import BaseFooter from './BaseFooter';
import PlatformFooter from './platform/PlatformFooter';

export default function FooterWrapper() {
  const pathname = usePathname();
  const isPlatformRoute = pathname && pathname.includes('/platform');

  return isPlatformRoute ? <FooterPlataform /> : <Footer />;
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
