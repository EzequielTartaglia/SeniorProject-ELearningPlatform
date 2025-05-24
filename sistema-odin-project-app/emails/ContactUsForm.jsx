"use client";
import { useNotification } from "@/contexts/NotificationContext";
import React, { useState } from "react";
import SubmitLoadingButton from "../components/forms/SubmitLoadingButton";
import Input from "../components/forms/Input";
import TextArea from "../components/forms/TextArea";

export default function ContactUsForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); 
  const { showNotification } = useNotification();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true); 
    setIsLoading(true);

    // Validación básica
    const isValid = Object.values(formData).every(value => value.trim() !== "");
    if (!isValid) {
      showNotification("Por favor, completa todos los campos.", "danger");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showNotification(
          "¡Correo electrónico enviado exitosamente!",
          "success"
        );
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          message: "",
        });
        setIsSubmitted(false); 
      } else {
        showNotification(
          "No se pudo enviar el correo electrónico. Intenta de nuevo.",
          "danger"
        );
      }
    } catch (error) {
      console.error("Error:", error);
      showNotification(
        "Error al enviar el correo electrónico. Por favor, intenta nuevamente.",
        "danger"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box-theme-home max-w-md mx-auto p-4 ">
      <Input
        label="Nombre"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        isSubmitted={isSubmitted}
        errorMessage="El nombre es requerido."
        required
        textWhite={true}
      />

      <Input
        label="Apellido"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        isSubmitted={isSubmitted}
        errorMessage="El apellido es requerido."
        required
        textWhite={true}
      />

      <Input
        label="Teléfono"
        type="tel"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        isSubmitted={isSubmitted}
        errorMessage="El teléfono es requerido."
        required
        textWhite={true}
      />

      <Input
        label="Correo electrónico"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        isSubmitted={isSubmitted}
        errorMessage="El correo electrónico es requerido."
        required
        textWhite={true}
      />

      <TextArea
        label="Mensaje"
        name="message"
        value={formData.message}
        onChange={handleChange}
        isSubmitted={isSubmitted}
        errorMessage="El mensaje es requerido."
        required
        rows={4}
        textWhite={true}
        note="Por favor, proporciona detalles sobre tu consulta o solicitud."
      />

      <SubmitLoadingButton
        type="submit"
        isLoading={isLoading}
        submitText="Enviando..."
      >
        Enviar correo electrónico
      </SubmitLoadingButton>
    </form>
  );
}
