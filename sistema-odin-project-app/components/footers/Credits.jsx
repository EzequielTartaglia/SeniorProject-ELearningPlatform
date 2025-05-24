"use client";

import Link from "next/link";

export default function Credits({paddingClass = 'p-1'}) {
  const systemName = process.env.NEXT_PUBLIC_SYSTEM_NAME;

  const developerInfo = {
    name: "Ezequiel",
    middleName: "Matias",
    surname: "Tartaglia",
    email: "ezequielmtartaglia@gmail.com",
    linkedin: "https://www.linkedin.com/in/ezequieltartaglia",
    github: "https://github.com/ezequieltartaglia",
  };

  const middleInitial = developerInfo.middleName ? developerInfo.middleName.charAt(0) : "";

  const currentYear = new Date().getFullYear();

  return (
    <div className={`bg-secondary text-primary ${paddingClass} text-center font-semibold`}>
      <div className="block sm:hidden">
        <div>{systemName}&#174;</div>
        <div>Todos los derechos reservados {currentYear}&copy;</div>
      </div>
    </div>
  );
}
