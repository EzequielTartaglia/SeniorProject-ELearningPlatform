"use client";

import { getStockProvider,deleteStockProvider } from "@/src/controllers/control_center/cc_stock_provider/cc_stock_provider";

import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import { FiEdit, FiTrash } from "react-icons/fi";
import Button from "@/components/Button";
import ConfirmModal from "@/components/ConfirmModal";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";

import { FaExclamationTriangle } from "react-icons/fa";

export default function ControlCenterStockProviderDetailsPage({
  controlCenterStockProviderId,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provider, setProvider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const { userControlCenter } = useUserControlCenterInfo();
  const { showNotification } = useNotification();

  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const fetchedProvider = await getStockProvider(controlCenterStockProviderId);

        if (
          (userControlCenter?.cc_user_role_id === 5 ||
            userControlCenter?.cc_user_role_id === 6 ||
            userControlCenter?.cc_user_role_id === 7) &&
          fetchedProvider.created_by_cc_user_business_id !==
            userControlCenter?.cc_user_business_id
        ) {
          setAccessDenied(true);
          return;
        }

        setProvider(fetchedProvider);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        showNotification("Error al cargar los datos.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [controlCenterStockProviderId, showNotification, userControlCenter]);

  const handleDeleteProvider = async () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteStockProvider(controlCenterStockProviderId);
      showNotification("¡Proveedor eliminado exitosamente!", "info");
      router.push(`/control_center/stock/stock_providers`);
    } catch (error) {
      console.error("Error eliminando el proveedor:", error);
      showNotification(
        "Ocurrió un error al intentar eliminar el proveedor.",
        "danger"
      );
    } finally {
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (!provider || loading) {
    return <LoadingSpinner />;
  }

  if (accessDenied) {
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
            className="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode "
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
        title={"Detalles del proveedor"}
        goBackRoute={"/control_center/stock/stock_providers"}
        goBackText={"Volver al listado de proveedores"}
      />
      <div className="box-theme p-4">
        <div className="flex flex-col sm:flex-row sm:items-center">
          <h3 className="text-2xl text-title-active-static font-semibold">
            Informacion general del proveedor
          </h3>
        </div>

        <div className="mt-4 p-4 bg-white rounded-lg shadow flex justify-between items-center">
          <h3 className="text-lg font-semibold text-title-active-static">
            Nombre:
          </h3>
          <p className="text-black font-semibold">{provider.name}</p>
        </div>

        {provider.description && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow flex flex-col justify-between items-start">
            <h3 className="text-lg font-semibold text-title-active-static">
              Descripcion:
            </h3>
            <p className="text-black font-semibold break-words w-full">
              {provider.description}
            </p>
          </div>
        )}

        <div className="flex justify-center sm:justify-end mt-4 sm:mt-0 space-x-2">
          {(userControlCenter?.cc_user_role_id === 6 ||
            userControlCenter?.cc_user_role_id === 3 ||
            userControlCenter?.cc_user_role_id === 4 ||
            userControlCenter?.cc_user_role_id === 7) && (
            <>
              <Button
                customClasses="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
                route={`/control_center/stock/stock_providers/${controlCenterStockProviderId}/edit`}
                isAnimated={false}
                icon={<FiEdit size={24} />}
                title="Editar"
              />

              <Button
                customClasses="mt-4 px-4 py-2 bg-red-600 text-white rounded-md shadow-md hover:bg-red-700 transition duration-300 font-semibold"
                customFunction={handleDeleteProvider}
                isAnimated={false}
                icon={<FiTrash size={24} />}
                title="Eliminar proveedor"
              />
            </>
          )}
        </div>
      </div>

     
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        message={"¿Estas seguro que deseas eliminar este proveedor?"}
      />
    </>
  );
}
