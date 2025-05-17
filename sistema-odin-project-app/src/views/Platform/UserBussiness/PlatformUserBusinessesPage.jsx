"use client";

import {
  deletePlatformUserBusiness,
  getPlatformUserBusinesses,
} from "@/src/controllers/platform/platform_user_business/platform_user_business";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserInfoContext } from "@/contexts/UserInfoContext";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import SearchInput from "@/components/SearchInput";

export default function PlatformUserBusinessesPage() {
  const [userBusinesses, setUserBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const { user } = useUserInfoContext();
  const { showNotification } = useNotification();

  const router = useRouter();

  useEffect(() => {
    async function fetchUsersBusinesses() {
      try {
        const fetchedUserBusinesses = await getPlatformUserBusinesses();

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

      await deletePlatformUserBusiness(id);

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
      (user.user_role_id === 4 || user.user_role_id === 5) && item.id !== 1
    );
  };

  const hasApprove = (item) => {
    return;
  };

  return (
    <>
      <PageHeader
        title={"Empresas en sistema"}
        goBackRoute={"/platform"}
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
          user.user_role_id === 4 || user.user_role_id === 5
            ? `/platform/platform_user_businesses/new`
            : null
        }
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={hasShow}
        hasEdit={hasEdit}
        buttonEditRoute={(id) =>
          `/platform/platform_user_businesses/${id}/edit`
        }
        hasDelete={true}
        buttonDeleteRoute={handleDeleteUserBusiness}
        hasApprove={hasApprove}
        confirmModalText={
          "¿Estás seguro de que deseas eliminar esta empresa asociada al sistema?"
        }
      />
    </>
  );
}
