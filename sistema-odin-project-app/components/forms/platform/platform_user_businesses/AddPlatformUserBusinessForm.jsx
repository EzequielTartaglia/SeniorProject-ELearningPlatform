"use client";

import { addPlatformUserBusiness } from "@/src/controllers/platform/platform_user_business/platform_user_business";

import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddPlatformUserBusinessForm() {
  const [userPlatformBusiness, setUserPlatformBusiness] = useState({
    name: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!userPlatformBusiness.name) {
      return;
    }

    setIsLoading(true);

    try {
      await addPlatformUserBusiness(userPlatformBusiness.name);

      showNotification("¡Empresa asociada al sistema exitosamente!", "success");
      
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/platform/platform_user_businesses`);
      }, 2000);

    } catch (error) {
      console.error("Error trying to add the platform user business:", error.message);
      setIsLoading(false); 
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserPlatformBusiness({ ...userPlatformBusiness, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Nueva empresa asociada al sistema"
        goBackRoute="/platform/platform_user_businesses"
        goBackText="Volver al listado de empresas asociadas al sistema"
      />

      <form
        onSubmit={handleSubmit}
        className="box-theme"
      >
        <Input
          label="Nombre"
          name="name"
          value={userPlatformBusiness.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit"> 
          Asociar empresa al sistema
        </SubmitLoadingButton>
      </form>
    </>
  );
}
