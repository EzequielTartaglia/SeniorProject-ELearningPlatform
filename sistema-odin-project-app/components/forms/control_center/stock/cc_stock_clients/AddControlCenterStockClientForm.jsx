"use client";

import { addStockClient } from "@/src/controllers/control_center/cc_stock_client/cc_stock_client";

import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

export default function AddControlCenterStockClientForm() {
  const { userControlCenter } = useUserControlCenterContext();

  const [client, setClient] = useState({
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

    if (!client.name) {
      return;
    }

    setIsLoading(true);

    try {
      await addStockClient(
        client.name,
        client.description,
        userControlCenter.cc_user_business_id
      );

      showNotification("¡Cliente agregado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/control_center/stock/stock_clients`);
      }, 2000);
    } catch (error) {
      console.error("Error trying to add client:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient({ ...client, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Nuevo cliente de stock"
        goBackRoute="/control_center/stock/stock_clients"
        goBackText="Volver al listado de clientes"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={client.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={
            client.name.trim() === "" && isSubmitted ? "Campo obligatorio" : ""
          }
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={client.description}
          placeholder="Escribe algo..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar cliente
        </SubmitLoadingButton>
      </form>
    </>
  );
}
