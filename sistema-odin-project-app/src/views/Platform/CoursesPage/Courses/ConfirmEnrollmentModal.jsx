import { useEffect, useState } from "react";
import { getCurrencyType } from "@/src/controllers/platform/currency_type/currency_type";
import { getPaymentMethod } from "@/src/controllers/platform/payment_method/payment_method";
import Button from "@/components/Button";

export default function ConfirmEnrollmentModal({
  isOpen,
  onClose,
  onConfirm,
  message,
  paymentMethods,
  setSelectedPaymentMethod,
  setSelectedPaymentLink,
  setSelectedPaymentMethodCurrency,
}) {
  const [selectedPaymentMethod, setSelectedPaymentMethodLocal] = useState(null);
  const [loadedPaymentMethods, setLoadedPaymentMethods] = useState([]);

  useEffect(() => {
    let parsedPaymentMethods = [];
    if (typeof paymentMethods === "string") {
      try {
        parsedPaymentMethods = JSON.parse(paymentMethods);
      } catch (error) {
        console.error("Error parsing payment methods JSON:", error);
      }
    } else {
      parsedPaymentMethods = paymentMethods;
    }

    const loadPaymentMethodDetails = async () => {
      const methodsWithDetails = await Promise.all(
        parsedPaymentMethods.map(async (method) => {
          const paymentMethodDetails = await getPaymentMethod(method.method_id);
          const currencyDetails = await getCurrencyType(method.currency_id);
          return {
            ...method,
            method_name: paymentMethodDetails?.name || "Metodo desconocido",
            currency_abbr:
              currencyDetails?.abbreviation || "Moneda desconocida",
          };
        })
      );
      setLoadedPaymentMethods(methodsWithDetails);
    };

    loadPaymentMethodDetails();
  }, [paymentMethods]);

  const handlePaymentMethodSelection = (method) => {
    setSelectedPaymentMethodLocal(method);
    setSelectedPaymentMethod(method);
    setSelectedPaymentLink(method.link);
    setSelectedPaymentMethodCurrency(method.currency_abbr);
  };

  const handleConfirm = () => {
    if (selectedPaymentMethod) {
      onConfirm(selectedPaymentMethod);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-primary p-6 rounded-lg shadow-lg text-center border-card-detail">
        <h2 className="text-lg mb-4 text-primary font-semibold">¿Continuar con la inscripción al curso  <span className="text-title-active-static">{message}</span>?</h2>
        {loadedPaymentMethods && loadedPaymentMethods.length > 0 ? (
          <div className="mb-4 p-3">
            <p className="text-title-active-static mb-2">
              <strong>Métodos de pago disponibles:</strong>
            </p>
            <ul className="text-left">
              {loadedPaymentMethods.map((method, index) => (
                <li
                  key={index}
                  className={`cursor-pointer pl-3 mt-4 ${
                    selectedPaymentMethod === method
                      ? "rounded-lg px-4 py-2 shadow-md transition duration-300 gradient-button-success border-primary-light"
                      : "rounded-lg border-secondary-light px-4 py-2 shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light bg-dark-mode"
                  }`}
                  onClick={() => handlePaymentMethodSelection(method)}
                >
                  <strong
                    className={`${
                      selectedPaymentMethod === method ? "text-title-active-static" : "text-primary"
                    }`}
                  >
                    Método:{" "}
                    <span
                      className={`${
                        selectedPaymentMethod === method
                          ? "text-primary"
                          : "text-title-active-static"
                      }`}
                    >
                      {method.method_name}
                    </span>
                  </strong>{" "}
                  <br />
                  <strong
                    className={`${
                      selectedPaymentMethod === method ? "text-title-active-static" : "text-primary"
                    }`}
                  >
                    Precio:{" "}
                    <span
                      className={`${
                        selectedPaymentMethod === method
                          ? "text-primary"
                          : "text-title-active-static"
                      }`}
                    >
                      {method.price} {method.currency_abbr}
                    </span>{" "}
                  </strong>
                  <br />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-primary">Cargando métodos de pago...</p>
        )}
        <div className="flex justify-center gap-4 mt-4">
          <Button
            customFunction={onClose}
            customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"
            text={"Cancelar"}
          />
          {selectedPaymentMethod ? (
            <Button
              customFunction={handleConfirm}
              customClasses="px-4 py-2 rounded gradient-button-confirm font-semibold"
              text={"Confirmar Inscripcion"}
            />
          ) : (
            <button
              className="px-4 py-2 rounded font-semibold cursor-not-allowed button-disabled"
              disabled
            >
              Confirmar inscripcion
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
