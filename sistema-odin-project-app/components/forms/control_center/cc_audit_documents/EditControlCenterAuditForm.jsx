"use client";

import {
  getAuditDocument,
  editAuditDocument,
  getAuditDocumentsByBusiness,
} from "@/src/controllers/control_center/cc_audit_document/cc_audit_document";
import { getControlCenterUser, getControlCenterUsers, getControlCenterUsersByBusiness } from "@/src/controllers/control_center/control_center_user/control_center_user";

import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import { FaExclamationTriangle } from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import MultiSelectInput from "../../MultiSelectInput";

export default function EditControlCenterAuditForm({
  controlCenterAuditDocumentId,
}) {
  const { userControlCenter } = useUserControlCenterInfo();

  const [ownerUser, setOwnerUser] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isMinTimeElapsed, setIsMinTimeElapsed] = useState(false);

  const [auditDocument, setAuditDocument] = useState({
    date: new Date().toISOString().split("T")[0],
    cc_audit_document_template_id: null,
    total_not_verified_points: 0,
    total_implemented_points: 0,
    total_partially_implemented_points: 0,
    total_not_implemented_points: 0,
    total_excluded_points: 0,
    created_by_cc_user_id: userControlCenter?.id,
    cc_client_id: null,
    cc_state_id: 1,
    accessible_users: [],
  });
  const [usersTable, setUsersTable] = useState([]);

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMinTimeElapsed(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedAudit = await getAuditDocument(controlCenterAuditDocumentId);
        
        const parsedAccessibleUsers = typeof fetchedAudit?.accessible_users === 'string'
          ? JSON.parse(fetchedAudit?.accessible_users)
          : fetchedAudit?.accessible_users;
  
        setAuditDocument({
          ...fetchedAudit,
          accessible_users: parsedAccessibleUsers || [],
        });
  
        if (userControlCenter.cc_user_role_id === 1 || userControlCenter.cc_user_role_id === 2 ||
          userControlCenter?.cc_user_role_id === 7) {
          const users = await getControlCenterUsersByBusiness(userControlCenter.cc_user_business_id);
          setUsersTable(users);
          
        } else {
          const users = await getControlCenterUsers();
          setUsersTable(users);
        }
     
        const fetchedUser = await getControlCenterUser(fetchedAudit?.created_by_cc_user_id);
        setOwnerUser(fetchedUser);
  
      } catch (error) {
        console.error("Error al obtener datos de las tablas de checkpoint_types:", error.message);
      }
    }
  
    fetchData();
  }, [controlCenterAuditDocumentId, userControlCenter?.cc_user_business_id, userControlCenter?.cc_user_role_id]);
  

  useEffect(() => {
    if (!auditDocument || !userControlCenter || !ownerUser) return;
    const filterAccess = () => {
      if (userControlCenter?.cc_user_role_id === 2 ||
        userControlCenter?.cc_user_role_id === 7) {
        return (
          ownerUser?.cc_user_business_id ===
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
  }, [
    auditDocument,
    ownerUser,
    ownerUser?.cc_user_business_id,
    userControlCenter,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !auditDocument.cc_audit_document_template_id ||
      !userControlCenter.id ||
      !auditDocument.cc_client_id ||
      !auditDocument.cc_state_id
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await editAuditDocument(
        controlCenterAuditDocumentId,
        auditDocument.date,
        auditDocument.cc_audit_document_template_id,
        auditDocument.total_not_verified_points,
        auditDocument.total_implemented_points,
        auditDocument.total_partially_implemented_points,
        auditDocument.total_not_implemented_points,
        auditDocument.total_excluded_points,
        auditDocument.created_by_cc_user_id,
        auditDocument.cc_client_id,
        auditDocument.cc_state_id,
        JSON.stringify(auditDocument.accessible_users)
      );

      showNotification("¡Auditoría actualizada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(
          `/control_center/admin/audits/${controlCenterAuditDocumentId}`
        );
      }, 2000);
    } catch (error) {
      console.error("Error trying to add the audit:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAuditDocument({ ...auditDocument, [name]: value });
  };

  const handleMultiSelectChange = (selectedUsers) => {
    setAuditDocument({
      ...auditDocument,
      accessible_users: selectedUsers.target.value,
    });
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
            className="mt-4 px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md  transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode "
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
        title="Editar auditoría"
        goBackRoute={`/control_center/admin/audits/${controlCenterAuditDocumentId}`}
        goBackText="Volver a informacion general de auditorias"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Fecha"
          name="date"
          type="date"
          value={auditDocument.date || new Date().toISOString().split("T")[0]}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={
            auditDocument.date.trim() === "" && isSubmitted
              ? "Campo obligatorio"
              : ""
          }
        />

        <MultiSelectInput
          label="Usuarios accesibles"
          name="accessible_users"
          value={auditDocument.accessible_users}
          onChange={handleMultiSelectChange}
          table={usersTable}
          columnName="first_name"
          columnName2="last_name"
          idColumn="id"
          required
          isSubmitted={isSubmitted}
          errorMessage="Debe seleccionar al menos un usuario"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Editar auditoria
        </SubmitLoadingButton>
      </form>
    </>
  );
}
