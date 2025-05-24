"use client";

import { editPlatformUserBusiness, getPlatformUserBusiness } from "@/src/controllers/platform/platform_user_business/platform_user_business";
import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function EditPlatformUserBusinessForm({ platformUserBusinessId }) {
  const [platformUserBusiness, setPlatformUserBusiness] = useState({
    id: platformUserBusinessId,
    name: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditable, setIsEditable] = useState(true); 

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchplatformUserBusiness = async () => {
      try {
        const fetchedPlatformUserBusiness = await getPlatformUserBusiness(platformUserBusinessId);
        setPlatformUserBusiness(fetchedPlatformUserBusiness);

        // unable if the business is the main business
        if (fetchedPlatformUserBusiness.id === 1) {
          setIsEditable(false);
        }
      } catch (error) {
        console.error("Error fetching platform user business:", error.message);
      }
    };
    fetchplatformUserBusiness();
  }, [platformUserBusinessId, showNotification]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!platformUserBusiness.name || !isEditable) {
      return;
    }

    setIsLoading(true);

    try {
      await editPlatformUserBusiness(platformUserBusinessId, platformUserBusiness.name);

      showNotification("¡Empresa editada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/platform_user_businesses`);
      }, 2000);
    } catch (error) {
      console.error("Error trying to update platform user business:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPlatformUserBusiness({ ...platformUserBusiness, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Editar empresa asociada al sistema"
        goBackRoute="/platform/platform_user_businesses"
        goBackText="Volver al listado de empresas asociadas al sistema"
      />

      {!isEditable ? (
        <div className="p-4 box-theme shadow rounded-lg text-center">
          <p>No se puede editar esta empresa asociada al sistema.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="box-theme">
          <Input
            label="Nombre"
            name="name"
            value={platformUserBusiness.name}
            required={true}
            placeholder=""
            onChange={handleInputChange}
            isSubmitted={isSubmitted}
            errorMessage="Campo obligatorio"
            disabled={!isEditable} 
          />

          <SubmitLoadingButton isLoading={isLoading} type="submit">
            Editar empresa asociada al sistema
          </SubmitLoadingButton>
        </form>
      )}
    </>
  );
}
