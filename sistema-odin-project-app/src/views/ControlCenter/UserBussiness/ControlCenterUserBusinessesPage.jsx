"use client";

import { getControlCenterUserBusinesses, deleteControlCenterUserBusiness } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import SearchInput from "@/components/SearchInput";

export default function ControlCenterUserBusinessesPage() {
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { userControlCenter } = useUserControlCenterContext();
  
  const { showNotification } = useNotification();

  const router = useRouter();

  useEffect(() => {
    async function fetchUsersBusinesses() {
      try {
        const fetchedUserBusinesses = await getControlCenterUserBusinesses();

        setUserBusinesses(fetchedUserBusinesses);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchUsersBusinesses();
  }, []);

  const handleDeleteUserBusiness = async (id) => {
    try {
      const userBusinessToDelete = userBusinesses.find(
        (userBusiness) => userBusiness.id === id
      );
      if (userBusinessToDelete && userBusinessToDelete.id === 1) {
        showNotification(
          "No se puede eliminar esta empresa asociada al sistema.",
          "danger"
        );
        return;
      }

      await deleteControlCenterUserBusiness(id);

      showNotification(
        "¡Empresa asociada al sistema eliminada exitosamente!",
        "info"
      );

      setUserBusinesses((prevUserBusiness) =>
        prevUserBusiness.filter((userBusiness) => userBusiness.id !== id)
      );
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const columns = ["name"];
  const columnAliases = {
    name: "Nombre",
  };

  const filteredData = userBusinesses
    .filter((userBusiness) => {
      const name = `${userBusiness.name}`.toLowerCase();
      const query = searchTerm.toLowerCase();
      return name.includes(query);
    })
    .map((userBusiness) => {
      return {
        id: userBusiness.id,
        name: userBusiness.name,
      };
    });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const hasShow = (item) => {
    return;
  };

  const hasEdit = (item) => {
    return (
      (userControlCenter.cc_user_role_id === 3 || userControlCenter.cc_user_role_id === 4 ||
        userControlCenter?.cc_user_role_id === 7) && item.id !== 1
    );
  };

  const hasCustomButton = (item) => {
    return (
      (userControlCenter.cc_user_role_id === 3 || userControlCenter.cc_user_role_id === 4 ||
        userControlCenter?.cc_user_role_id === 7) && item.id !== 1
    );
  };

  return (
    <>
      <PageHeader
        title={"Empresas en sistema"}
        goBackRoute={"/control_center"}
        goBackText={"Volver al inicio"}
      />

      <div className="rounded-lg w-full">
        <div className="flex justify-center">
          <SearchInput
            placeholder="Buscar empresa..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <Table
        title={"Empresas registradas"}
        buttonAddRoute={
          userControlCenter.cc_user_role_id === 4 || userControlCenter.cc_user_role_id === 5 ||
          userControlCenter?.cc_user_role_id === 7
            ? `/control_center/control_center_user_businesses/new`
            : null
        }
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={hasShow}
        hasEdit={hasEdit}
        buttonEditRoute={(id) =>
          `/control_center/control_center_user_businesses/${id}/edit`
        }
        hasDelete={true}
        buttonDeleteRoute={handleDeleteUserBusiness}
        hasCustomButton={hasCustomButton}
        customButtonRoute={(id) =>
          `/control_center/control_center_user_businesses/${id}/manage_plugins`
        }
        confirmModalText={
          "¿Estás seguro de que deseas eliminar esta empresa asociada al sistema?"
        }
      />
    </>
  );
}
