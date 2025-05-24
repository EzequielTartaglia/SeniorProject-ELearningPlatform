"use client";

import {
  getPlatformUsers,
  editPlatformUserStatus,
} from "@/src/models/platform/platform_user/platform_user";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Input from "@/components/forms/Input";
import SubmitLoadingButton from "../SubmitLoadingButton";

export default function LoginForm({ onCloseModal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setIsSubmitted(true);
      setErrorMessage("Por favor, complete todos los campos.");
      return;
    }

    setIsSubmitted(false);
    setIsLoading(true);
    setErrorMessage("");

    try {
      const users = await getPlatformUsers();
      const foundUser = users.find((user) => user.email === email);

      if (!foundUser || foundUser.password !== password) {
        setErrorMessage(
          "Usuario y/o contraseña incorrectos. Intente nuevamente."
        );
        setIsLoading(false);
        return;
      }

      // Verificar si el usuario está baneado o bloqueado
      if (foundUser.is_banned) {
        setErrorMessage("Acceso restringido de manera permanente,para más información comunicate con soporte.");
        setIsLoading(false);
        return;
      }

      if (foundUser.is_blocked) {
        setErrorMessage("Acceso restringido de manera temporal, para más información comunicate con soporte.");
        setIsLoading(false);
        return;
      }

      // Marcar al usuario como activo
      await editPlatformUserStatus(foundUser.id, true);

      // Realizar el inicio de sesión con axios
      const loginResponse = await axios.post(`/api/auth/login`, foundUser);

      setTimeout(() => {
        setIsLoading(false);
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      setErrorMessage("Error al iniciar sesión. Inténtalo de nuevo.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-100 flex items-center justify-center z-50">
      <div className="box-theme-login">
        <form onSubmit={handleSubmit}>
          <Input
            label="Email"
            name="email"
            value={email}
            placeholder=""
            onChange={(e) => setEmail(e.target.value)}
            isSubmitted={isSubmitted}
            errorMessage="Campo obligatorio"
          />

          <Input
            label="Contraseña"
            type="password"
            name="password"
            value={password}
            placeholder=""
            onChange={(e) => setPassword(e.target.value)}
            isSubmitted={isSubmitted}
            errorMessage="Campo obligatorio"
          />

          {errorMessage && (
            <p className="text-delete-link-active mt-2">{errorMessage}</p>
          )}

          <SubmitLoadingButton
            type="submit"
            isLoading={isLoading}
            submitText={
              isLoading
                ? "Iniciando sesión"
                : "Iniciar sesión"
            }
          >
            Iniciar sesión
          </SubmitLoadingButton>
        </form>
        <button
          onClick={onCloseModal}
          className="text-primary focus:outline-none text-title px-3 py-2 absolute right-0 top-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
