import Button from "./Button";

export default function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-primary p-6 rounded-lg shadow-lg text-center border-card-detail relative z-60">
        <span className="mb-4 text-primary font-semibold">{message}</span>
        <div className="flex justify-center gap-4 mt-4">
          <Button
            customFunction={onClose}
            customClasses="px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 border-secondary-light text-title-active-static font-semibold gradient-button"
            text={"Cancelar"}
          />
          <Button
            customFunction={onConfirm}
            customClasses="px-4 py-2 rounded gradient-button-confirm font-semibold"
            text={"Confirmar"}
          />
        </div>
      </div>
    </div>
  );
}
