"use client";

import Button from "@/components/Button";
import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getPlatformSetting } from "@/src/models/platform/platform_setting/platform_setting";
import { useEffect, useState } from "react";

export default function PlatformSettingsPage() {
  const [settings, setSettings] = useState({
    contact_number: "",
    developer_name: "",
    developer_email: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getPlatformSetting();
        setSettings(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching platform settings:", error);
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          <PageHeader
            title={"Ajustes"}
            goBackRoute={"/platform"}
            goBackText={"Volver al inicio"}
          />
          <div className="box-theme p-4">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Datos generales
                </h2>
              </div>
              <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 space-x-2">
                <Button
                  customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button"
                  route={"/platform/platform_settings/edit"}
                  isAnimated={false}
                  title="Editar"
                  text={"Editar"}
                />
              </div>
            </div>
            <div className="mt-6">
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-title-active-static">
                  Número de contacto (WhatsApp):
                </h3>
                <p className="text-primary">{ settings.contact_number || "Número pendiente de ingresar" }</p>
              </div>
            </div>
          </div>

          <div className="box-theme p-4">
            <div className="flex flex-col sm:flex-row sm:items-center">
              <div className="flex-1 mt-4 sm:mt-0 text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Datos del desarrollador
                </h2>
              </div>
            </div>
            <div className="mt-6">
              <div className="mt-2">
                <h3 className="text-lg font-semibold text-title-active-static">
                  Desarrollador del sistema:
                </h3>
                <p className="text-primary">{settings.developer_name}</p>
              </div>
              <div className="mt-2">
                <h3 className="text-lg font-semibold text-title-active-static">
                  Correo del desarrollador:
                </h3>
                <p className="text-primary">
                  {settings.developer_contact_email}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
