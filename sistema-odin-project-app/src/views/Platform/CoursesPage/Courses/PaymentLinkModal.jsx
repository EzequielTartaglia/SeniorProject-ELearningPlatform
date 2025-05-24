import Button from "@/components/Button";
import React from "react";

export default function PaymentLinkModal({ isOpen, onClose, paymentLink }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary p-6 rounded-lg shadow-lg text-center">
        <h2 className="mb-4 text-primary">
        <a 
          href={paymentLink} 
          className="mb-4 text-blue-500 underline" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Link de pago
        </a>
        </h2>
        <p className="text-primary my-4">
          Una vez realizado el pago, enviar el comprobante a administración para continuar con el proceso.
        </p>
        <div className="flex justify-center gap-4 mt-4 font-semibold">
          <Button
            customFunction={onClose}
            customClasses="button-primary-bg px-4 py-2 rounded"
            text={"Cerrar"}
          />
        </div>
      </div>
    </div>
  );
}
