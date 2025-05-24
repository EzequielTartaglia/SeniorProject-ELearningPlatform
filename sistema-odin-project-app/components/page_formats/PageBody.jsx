"use client";

import { usePathname } from "next/navigation";

export default function PageBody({ children }) {
  const pathname = usePathname();

  const isHomePage = pathname === "/";

  return (
    <div
      className={`flex items-center justify-center min-h-screen mt-8 ${
        isHomePage ? "p-0" : "p-4"
      }`}
    >
      <div
        className={`flex flex-col items-center w-full ${
          isHomePage
            ? "p-2"
            : "p-4 sm:min-w-[640px] sm:max-w-[768px] md:min-w-[768px] md:max-w-[1024px] lg:min-w-[930px] lg:max-w-[930px] xl:min-w-[1280px] xl:max-w-[1536px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
