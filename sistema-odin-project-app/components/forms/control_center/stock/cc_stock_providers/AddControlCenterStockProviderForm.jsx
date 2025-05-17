"use client";

import { addStockProvider } from "@/src/controllers/control_center/cc_stock_provider/cc_stock_provider";

import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

export default function AddControlCenterStockProviderForm() {
  const { userControlCenter } = useUserControlCenterContext();

  const [provider, setProvider] = useState({
    name: "",
    description: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!provider.name) {
      return;
    }

    setIsLoading(true);

    try {
      await addStockProvider(
        provider.name,
        provider.description,
        userControlCenter.cc_user_business_id
      );

      showNotification("¡Proveedor agregado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/control_center/stock/stock_providers`);
      }, 2000);
    } catch (error) {
      console.error("Error trying to add provider:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProvider({ ...provider, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Nuevo proveedor de stock"
        goBackRoute="/control_center/stock/stock_providers"
        goBackText="Volver al listado de proveedores"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={provider.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={
            provider.name.trim() === "" && isSubmitted ? "Campo obligatorio" : ""
          }
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={provider.description}
          placeholder="Escribe algo..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar proveedor
        </SubmitLoadingButton>
      </form>
    </>
  );
}
