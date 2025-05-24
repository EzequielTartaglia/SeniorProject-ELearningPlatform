"use client";

import { getStockClients, deleteStockClient } from "@/src/controllers/control_center/cc_stock_client/cc_stock_client";
import { getControlCenterUserBusinesses } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";

import { useEffect, useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import Table from "@/components/tables/Table";

export default function ControlCenterStockClientsPage() {
  const [clients, setClients] = useState([]);
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

        const fetchedClients = await getStockClients();
        const fetchedUserBusinesses = await getControlCenterUserBusinesses();

        setClients(fetchedClients);
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
      const resultData = clients
        .filter((client) => {
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
          return false;
        })
        .map((client) => {
          const userPlatformBusiness = platformUserBusinesses.find(
            (business) => business.id === client.created_by_cc_user_business_id
          );

          return {
            id: client.id,
            name: client.name,
            created_by_cc_user_business_id: userPlatformBusiness
              ? userPlatformBusiness.name
              : "N/A",
          };
        });

      setFilteredData(resultData);
    }

    filterData();
  }, [clients, platformUserBusinesses, userControlCenter]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = ["name", "created_by_cc_user_business_id"];

  const columnAliases = {
    name: "Cliente",
    created_by_cc_user_business_id: "Cliente de empresa",
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

  const handleDeleteClient = async (id) => {
    try {
      const clientToDelete = clients.find((client) => client.id === id);

      await deleteStockClient(id);

      showNotification("¡Cliente eliminado exitosamente!", "info");

      setClients((prevClients) =>
        prevClients.filter((client) => client.id !== id)
      );
    } catch (error) {
      console.error("Error deleting client:", error.message);
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
        title={"Gestionar clientes de stock"}
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
        title={"Clientes registrados"}
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
        buttonAddRoute={`/control_center/stock/stock_clients/new`}
        hasShow={hasShow}
        buttonShowRoute={(id) => `/control_center/stock/stock_clients/${id}`}
        hasEdit={hasEdit}
        buttonEditRoute={(id) => `/control_center/stock/stock_clients/${id}/edit`}
        hasDelete={
          userControlCenter?.cc_user_role_id === 6 ||
          userControlCenter?.cc_user_role_id === 3 ||
          userControlCenter?.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
        }
        buttonDeleteRoute={handleDeleteClient}
        confirmModalText={"¿Estás seguro de que deseas eliminar este cliente?"}
      />
    </>
  );
}
