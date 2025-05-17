"use client";

import { addAuditDocument } from "@/src/controllers/control_center/cc_audit_document/cc_audit_document";
import { getClients } from "@/src/controllers/control_center/cc_client/cc_client";
import { getAuditDocumentTemplates } from "@/src/controllers/control_center/cc_audit_document_template/cc_audit_document_template";
import { getControlCenterUsers, getControlCenterUsersByBusiness } from "@/src/controllers/control_center/control_center_user/control_center_user";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "@/components/forms/SelectInput";
import MultiSelectInput from "@/components/forms/MultiSelectInput";

export default function AddControlCenterAuditForm() {
  const { userControlCenter } = useUserControlCenterInfo();
  const router = useRouter();
  const { showNotification } = useNotification();

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

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [auditDocumentTemplatesTable, setAuditDocumentTemplatesTable] =
    useState([]);
  const [clientsTable, setClientsTable] = useState([]);
  const [usersTable, setUsersTable] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const templates = await getAuditDocumentTemplates();
        setAuditDocumentTemplatesTable(templates);

        const clients = await getClients();
        const filteredClients = filterClientsByRole(clients, userControlCenter);
        setClientsTable(filteredClients);

      if (userControlCenter.cc_user_role_id === 1 || userControlCenter.cc_user_role_id === 2 ||
        userControlCenter?.cc_user_role_id === 7) {
          const users = await getControlCenterUsersByBusiness(userControlCenter.cc_user_business_id);
          setUsersTable(users);
          
        } else {
          const users = await getControlCenterUsers();
          setUsersTable(users);
        }

      } catch (error) {
        console.error("Error al obtener los datos:", error.message);
      }
    }
    fetchData();
  }, [userControlCenter]);

  const filterClientsByRole = (clients, userControlCenter) => {
    if (
      userControlCenter?.cc_user_role_id === 1 ||
      userControlCenter?.cc_user_role_id === 2 ||
      userControlCenter?.cc_user_role_id === 7
    ) {
      return clients.filter(
        (client) =>
          client.created_by_cc_user_business_id ===
          userControlCenter.cc_user_business_id
      );
    }
    if (
      userControlCenter?.cc_user_role_id === 3 ||
      userControlCenter?.cc_user_role_id === 4 
    ) {
      return clients;
    }
    return clients;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !auditDocument.cc_audit_document_template_id ||
      !auditDocument.cc_client_id ||
      !auditDocument.cc_state_id
    ) {
      return;
    }

    setIsLoading(true);

    try {
      const newAudit = await addAuditDocument(
        auditDocument.date,
        auditDocument.cc_audit_document_template_id,
        auditDocument.total_not_verified_points,
        auditDocument.total_implemented_points,
        auditDocument.total_partially_implemented_points,
        auditDocument.total_not_implemented_points,
        auditDocument.total_excluded_points,
        userControlCenter.id,
        auditDocument.cc_client_id,
        auditDocument.cc_state_id,
        JSON.stringify(auditDocument.accessible_users)
      );

      console.log(newAudit);
      if (!newAudit || newAudit.length === 0) {
        throw new Error("No se pudo crear la auditoría.");
      }

      const newAuditCreated = newAudit[0];
      showNotification("¡Auditoría creada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/control_center/admin/audits/${newAuditCreated.id}`);
      }, 2000);
    } catch (error) {
      console.error("Error al crear la auditoría:", error.message);
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

  return (
    <>
      <PageHeader
        title="Crear auditoría"
        goBackRoute="/control_center/admin/audits"
        goBackText="Volver al listado de auditorías"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Fecha"
          name="date"
          type="date"
          value={auditDocument.date || new Date().toISOString().split("T")[0]}
          onChange={handleInputChange}
          required
          isSubmitted={isSubmitted}
          errorMessage={!auditDocument.date && "Campo obligatorio"}
        />

        <SelectInput
          label="Cliente a auditar"
          name="cc_client_id"
          value={auditDocument.cc_client_id}
          onChange={handleInputChange}
          table={clientsTable}
          columnName="name"
          idColumn="id"
          required
          isSubmitted={isSubmitted}
          errorMessage={!auditDocument.cc_client_id && "Campo obligatorio"}
        />

        <SelectInput
          label="Plantilla de auditoría"
          name="cc_audit_document_template_id"
          value={auditDocument.cc_audit_document_template_id}
          onChange={handleInputChange}
          table={auditDocumentTemplatesTable}
          columnName="title"
          idColumn="id"
          required
          isSubmitted={isSubmitted}
          errorMessage={
            !auditDocument.cc_audit_document_template_id && "Campo obligatorio"
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
          Crear auditoría
        </SubmitLoadingButton>
      </form>
    </>
  );
}
