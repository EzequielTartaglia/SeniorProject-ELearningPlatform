"use client";

import {
  getControlCenterUsers,
  deleteControlCenterUser,
} from "@/src/controllers/control_center/control_center_user/control_center_user";
import { getControlCenterUserRoles } from "@/src/controllers/control_center/control_center_user_role/control_center_user_role";
import { getControlCenterUserBusinesses } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import SearchInput from "@/components/SearchInput";
import UserStatusFilter from "@/components/filters/users_filters/UserStatusFilter";
import UserRoleFilter from "@/components/filters/users_filters/UserRoleFilter";

export default function AdminUsersControlCenterPage() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const { userControlCenter } = useUserControlCenterContext();
  const { showNotification } = useNotification();

  const router = useRouter();

  useEffect(() => {
    async function fetchUsersAndRoles() {
      try {
        const fetchedUsers = await getControlCenterUsers();
        const fetchedRoles = await getControlCenterUserRoles();
        const fetchedBusinesses = await getControlCenterUserBusinesses();

        setUsers(fetchedUsers);
        setRoles(fetchedRoles);
        setBusinesses(fetchedBusinesses);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchUsersAndRoles();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      const userToDelete = users.find((user) => user.id === id);
      if (userToDelete && userToDelete.cc_user_role_id === 4) {
        showNotification("No se puede eliminar este usuario.", "danger");
        return;
      }

      await deleteControlCenterUser(id);

      showNotification("¡Usuario eliminado exitosamente!", "info");

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user:", error.message);
    }
  };

  const columns = [
    "first_name",
    "last_name",
    "phone",
    "email",
    "user_role",
    "cc_user_business",
    "is_active",
  ];
  const columnAliases = {
    first_name: "Nombre",
    last_name: "Apellido",
    phone: "Celular",
    email: "Correo Electrónico",
    user_role: "Rol",
    cc_user_business: "Empresa",
    is_active: "Actividad",
  };

  const filteredData = users
    .filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const email = user.email ? user.email.toLowerCase() : "";
      const query = searchTerm.toLowerCase();
      return (
        fullName.includes(query) ||
        email.includes(query) ||
        user.phone.includes(query)
      );
    })
    .filter((user) => {
      if (statusFilter === "all") {
        return true;
      }
      return statusFilter === "online" ? user.is_active : !user.is_active;
    })
    .filter((user) => {
      if (roleFilter === "all") {
        return true;
      }
      return user.cc_user_role_id === parseInt(roleFilter);
    })
    .map((user) => {
      const userRole = roles.find(
        (role) => role.id === user.cc_user_role_id
      );
      const userBusiness = businesses.find(
        (business) => business.id === user.cc_user_business_id
      );

      return {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        phone: user.phone,
        email: user.email,
        user_role: userRole ? userRole.name : "N/A",
        cc_user_business: userBusiness ? userBusiness.name : "N/A",
        is_active: user.is_active ? "En línea" : "Desconectado",
      };
    });

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
  };

  const handleRoleChange = (value) => {
    setRoleFilter(value);
  };

  const hasShow = (item) => {
    return;
  };

  const hasEdit = (item) => {
    return;
  };

  const hasApprove = (item) => {
    return;
  };

  return (
    <>
      <PageHeader
        title={"Usuarios"}
        goBackRoute={"/control_center"}
        goBackText={"Volver al inicio"}
      />

      <div className="p-4 box-theme shadow rounded-lg mb-4 w-full">
        <div className="flex justify-center mb-4">
          <SearchInput
            placeholder="Buscar correo electronico o curso..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <UserStatusFilter
            statusFilter={statusFilter}
            onStatusChange={handleStatusChange}
          />

          <UserRoleFilter
            roleFilter={roleFilter}
            roles={roles}
            onRoleChange={handleRoleChange}
          />
        </div>
      </div>

      <Table
        title={"Usuarios registrados"}
        buttonAddRoute={
          userControlCenter.cc_user_role_id === 3 ||
          userControlCenter.cc_user_role_id === 4 ||
          userControlCenter?.cc_user_role_id === 7
            ? `/control_center/users/sign_up`
            : null
        }
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={hasShow}
        hasEdit={hasEdit}
        hasDelete={true}
        buttonDeleteRoute={handleDeleteUser}
        hasApprove={hasApprove}
        confirmModalText={"¿Estás seguro de que deseas eliminar este usuario?"}
      />
    </>
  );
}
