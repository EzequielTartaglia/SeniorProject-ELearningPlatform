"use client";

import React, { useState, useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function NotPermissionPageControlCenter() {
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
        <div className="flex justify-center items-center h-screen ">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen ">
          <div className="flex flex-col items-center p-6 card-theme border-secondary-light rounded-md shadow-lg">
            <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
            <h1 className="text-red-600 text-3xl font-semibold mb-2">
              Acceso denegado
            </h1>
            <p className="text-white text-center">
            Lo sentimos, no tienes permiso para acceder a esta página. 
              Si crees que esto es un error, contacta al administrador.
            </p>
            <button
              className="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode "
              onClick={() => (window.location.href = "/control_center")}
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </>
  );
}
