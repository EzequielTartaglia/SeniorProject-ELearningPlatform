"use client";

import { getStockProviders, deleteStockProvider } from "@/src/controllers/control_center/cc_stock_provider/cc_stock_provider";
import { getControlCenterUserBusinesses } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";

import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import Table from "@/components/tables/Table";


export default function ControlCenterStockProvidersPage() {
  const [providers, setProviders] = useState([]);
  const [platformUserBusinesses, setPlatformUserBusinesses] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const { userControlCenter } = useUserControlCenterInfo();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const fetchedProviders = await getStockProviders();
        const fetchedUserBusinesses = await getControlCenterUserBusinesses();

        setProviders(fetchedProviders);
        setPlatformUserBusinesses(fetchedUserBusinesses);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        showNotification("Error al cargar los datos.", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showNotification]);

  useEffect(() => {
    function filterData() {
      const resultData = providers
        .filter((provider) => {
          if (
            userControlCenter?.cc_user_role_id === 5 ||
            userControlCenter?.cc_user_role_id === 6 ||
            userControlCenter?.cc_user_role_id === 7
          ) {
            return (
              provider?.created_by_cc_user_business_id ===
              userControlCenter?.cc_user_business_id
            );
          } else if (
            userControlCenter?.cc_user_role_id === 3 ||
            userControlCenter?.cc_user_role_id === 4
          ) {
            return true;
          }
          return false;
        })
        .map((provider) => {
          const userPlatformBusiness = platformUserBusinesses.find(
            (business) => business.id === provider.created_by_cc_user_business_id
          );

          return {
            id: provider.id,
            name: provider.name,
            created_by_cc_user_business_id: userPlatformBusiness
              ? userPlatformBusiness.name
              : "N/A",
          };
        });

      setFilteredData(resultData);
    }

    filterData();
  }, [providers, platformUserBusinesses, userControlCenter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = ["name", "created_by_cc_user_business_id"];

  const columnAliases = {
    name: "Proveedor",
    created_by_cc_user_business_id: "Proveedor de empresa",
  };

  const hasShow = (item) => {
    return (
      userControlCenter?.cc_user_role_id === 5 ||
      userControlCenter?.cc_user_role_id === 6 ||
      userControlCenter?.cc_user_role_id === 3 ||
      userControlCenter?.cc_user_role_id === 4 ||
      userControlCenter?.cc_user_role_id === 7
    );
  };

  const hasEdit = (item) => {
    return (
      userControlCenter?.cc_user_role_id === 6 ||
      userControlCenter?.cc_user_role_id === 3 ||
      userControlCenter?.cc_user_role_id === 4 ||
      userControlCenter?.cc_user_role_id === 7
    );
  };

  const handleDeleteProvider = async (id) => {
    try {
      const providerToDelete = providers.find((provider) => provider.id === id);

      await deleteStockProvider(id);

      showNotification("¡Proveedor eliminado exitosamente!", "info");

      setClients((prevProviders) =>
        prevProviders.filter((provider) => provider.id !== id)
      );
    } catch (error) {
      console.error("Error deleting provider:", error.message);
    }
  };

  const hasApprove = (item) => {
    return;
  };

  if (!filteredData) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <PageHeader
        title={"Gestionar proveedores de stock"}
        goBackRoute={"/control_center"}
        goBackText={"Volver al inicio"}
      />

      <div className="p-4 w-full">
        <div className="flex-col md:flex-row flex justify-center mb-4 gap-0 md:gap-4">
          <SearchInput
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <Table
        title={"Proveedores registrados"}
        columns={columns}
        data={filteredData.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        columnAliases={columnAliases}
        hasAdd={
          userControlCenter?.cc_user_role_id === 6 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonAddRoute={`/control_center/stock/stock_providers/new`}
        hasShow={hasShow}
        buttonShowRoute={(id) => `/control_center/stock/stock_providers/${id}`}
        hasEdit={hasEdit}
        buttonEditRoute={(id) => `/control_center/stock/stock_providers/${id}/edit`}
        hasDelete={
          userControlCenter?.cc_user_role_id === 6 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonDeleteRoute={handleDeleteProvider}
        confirmModalText={"¿Estás seguro de que deseas eliminar este proveedor?"}
      />
    </>
  );
}
