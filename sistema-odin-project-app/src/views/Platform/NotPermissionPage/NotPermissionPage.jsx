"use client";

import LoadingSpinner from "@/components/LoadingSpinner";
import React, { useState, useEffect } from "react";

export default function NotPermissionPage() {
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSpinner ? (
        <LoadingSpinner />
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="text-primary text-2xl">Acceso denegado</div>
        </div>
      )}
    </>
  );
}
