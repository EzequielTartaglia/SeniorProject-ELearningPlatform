"use client";

import { changeUserPassword } from "@/src/controllers/platform/platform_user/platform_user";
import { useState } from "react";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import { useUserInfoContext } from "@/contexts/UserInfoContext";
import PageHeader from "@/components/page_formats/PageHeader";
import Input from "@/components/forms/Input";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function ChangePasswordForm() {
  const { user } = useUserInfoContext();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let errors = {};

    if (!currentPassword) {
      errors.currentPassword = "Campo obligatorio";
    } else if (currentPassword !== user.password) {
      errors.currentPassword = "Contraseña actual incorrecta.";
    }

    if (!newPassword) {
      errors.newPassword = "Campo obligatorio";
    }

    if (newPassword !== confirmNewPassword) {
      errors.confirmNewPassword = "Las nuevas contraseñas no coinciden.";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitted(true);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      await changeUserPassword(user.id, currentPassword, newPassword);

      showNotification("¡Contraseña cambiada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push("/platform/user/profile");
      }, 2000);
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error.message);
      setFormErrors({ general: "Hubo un problema al cambiar la contraseña. Inténtalo de nuevo." });
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "currentPassword") {
      setCurrentPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmNewPassword") {
      setConfirmNewPassword(value);
    }

    setFormErrors({
      ...formErrors,
      [name]: undefined,
    });
  };

  return (
    <>
      <PageHeader
        title="Cambiar Contraseña"
        goBackRoute="/platform/user/profile"
        goBackText="Volver al perfil"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Contraseña actual"
          type="password"
          name="currentPassword"
          value={currentPassword}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={formErrors.currentPassword}
          required={true}
        />

        <Input
          label="Nueva contraseña"
          name="newPassword"
          type="password"
          value={newPassword}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={formErrors.newPassword}
          required={true}
        />

        <Input
          label="Confirmar nueva contraseña"
          name="confirmNewPassword"
          type="password"
          value={confirmNewPassword}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage={formErrors.confirmNewPassword}
          required={true}
        />

        {formErrors.general && (
          <p className="text-red-500 mt-2 font-semibold">
            {formErrors.general}
          </p>
        )}

        <SubmitLoadingButton
          type="submit"
          isLoading={isLoading}
          submitText="Cambiar Contraseña"
        >
          Cambiar Contraseña
        </SubmitLoadingButton>
      </form>
    </>
  );
}
