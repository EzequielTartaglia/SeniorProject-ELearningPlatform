"use client";

import { getStockClient, editStockClient} from "@/src/controllers/control_center/cc_stock_client/cc_stock_client";

import { useNotification } from "@/contexts/NotificationContext";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import { FaExclamationTriangle } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditControlCenterStockClientForm({ controlCenterStockClientId }) {
  const { userControlCenter } = useUserControlCenterInfo();
  const [client, setClient] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const fetchedClient = await getStockClient(controlCenterStockClientId);
        setClient(fetchedClient);
      } catch (error) {
        console.error("Error fetching client:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClient();
  }, [controlCenterStockClientId]);

  useEffect(() => {
    if (!client || !userControlCenter) return;

    const filterAccess = () => {
      if (
        userControlCenter?.cc_user_role_id === 5 ||
        userControlCenter?.cc_user_role_id === 6 ||
        userControlCenter?.cc_user_role_id === 7
      ) {
        return (
          client?.created_by_cc_user_business_id ===
          userControlCenter?.cc_user_business_id
        );
      } else if (
        userControlCenter?.cc_user_role_id === 3 ||
        userControlCenter?.cc_user_role_id === 4
      ) {
        return true;
      }
    };
    setHasAccess(filterAccess());
  }, [client, userControlCenter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!client.name.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      await editStockClient(
        client.id,
        client.name,
        client.description,
        userControlCenter.cc_user_business_id
      );
      showNotification("¡Cliente editado exitosamente!", "success");
      setTimeout(() => {
        setIsLoading(false);
        router.push(`/control_center/stock/stock_clients`);
      }, 2000);
    } catch (error) {
      console.error("Error trying to update client:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClient((prevClient) => ({ ...prevClient, [name]: value }));
  };

  if (isLoading || !isMinTimeElapsed) {
    return <LoadingSpinner />;
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col justify-center items-center h-screen ">
        <div className="flex flex-col items-center p-6 card-theme border-secondary-light rounded-md shadow-lg">
          <FaExclamationTriangle className="text-red-500 text-6xl mb-4" />
          <h1 className="text-red-600 text-3xl font-semibold mb-2">
            Acceso denegado
          </h1>
          <p className="text-white text-center">
          Lo sentimos, no tienes permiso para acceder a esta página. Si crees
            que esto es un error, contacta al administrador.
          </p>
          <button
            className="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold gradient-button "
            onClick={() => (window.location.href = "/control_center")}
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Editar cliente"
        goBackRoute="/control_center/stock/stock_clients"
        goBackText="Volver al listado de clientes"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={client.name}
          required={true}
          placeholder="Nombre del cliente"
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={
            client.name.trim() === "" && isSubmitted ? "Campo obligatorio" : ""
          }
        />

        <Input
          label="Descripción"
          name="description"
          value={client.description}
          placeholder="Escribe aqui..."
          onChange={handleInputChange}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar cliente
        </SubmitLoadingButton>
      </form>
    </>
  );
}
