"use client";

import { getAuditDocumentRatingOptions } from "@/src/controllers/control_center/cc_audit_document_rating_option/cc_audit_document_rating_option";
import { getAuditDocumentTemplateCheckpoint } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint/cc_audit_document_template_checkpoint";
import { addAuditDocumentCheckpoint } from "@/src/controllers/control_center/cc_audit_document_checkpoint/cc_audit_document_checkpoint";
import { getAuditDocumentTemplateCheckpointTypes } from "@/src/controllers/control_center/cc_audit_document_template_checkpoint_type/cc_audit_document_template_checkpoint_type";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import SelectInput from "@/components/forms/SelectInput";
import TextArea from "@/components/forms/TextArea";
import FileInput from "@/components/forms/FileInput";

export default function CreateCheckpointForm({
  controlCenterAuditDocumentId,
  checkpointTemplateId,
  onCreate
}) {
  const [ratingOptionsTable, setRatingOptionsTable] = useState([]);
  const [checkpointTypes, setCheckpointTypes] = useState([]);
  const [templateCheckpoint, setTemplateCheckpoint] = useState([]);

  const [checkpoint, setCheckpoint] = useState({
    cc_audit_document_template_checkpoint_id: checkpointTemplateId,
    has_image_preview_1: false,
    image_preview_link_1: "",
    has_image_preview_2: false,
    image_preview_link_2: "",
    has_image_preview_3: false,
    image_preview_link_3: "",
    has_image_preview_4: false,
    image_preview_link_4: "",
    has_image_preview_5: false,
    image_preview_link_5: "",
    cc_audit_document_rating_option_id: null,
    cc_audit_document_id: controlCenterAuditDocumentId,
    description: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        const types = await getAuditDocumentTemplateCheckpointTypes();
        setCheckpointTypes(types);
  
        const ratingOptions = await getAuditDocumentRatingOptions();
        setRatingOptionsTable(ratingOptions);
  
        const fetchedAuditTemplateCheckpoint =
          await getAuditDocumentTemplateCheckpoint(checkpointTemplateId);
  
        setTemplateCheckpoint(fetchedAuditTemplateCheckpoint);
      } catch (error) {
        console.error(
          "Error al cargar las opciones de calificación o el template:",
          error.message
        );
      }
    }
    fetchData();
  }, [checkpointTemplateId, controlCenterAuditDocumentId]);
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setCheckpoint((prevCheckpoint) => ({
      ...prevCheckpoint,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
  };

  const handleFileUploadSuccess = (url) => {
    setCheckpoint((prevCheckpoint) => ({
      ...prevCheckpoint,
      image_preview_link_1: url,
      has_image_preview_1: true,
    }));
  };

  const handleFileChange2 = (event) => {
    console.log(event.target.files[0]);
  };

  const handleFileUploadSuccess2 = (url) => {
    setCheckpoint((prevCheckpoint) => ({
      ...prevCheckpoint,
      image_preview_link_2: url,
      has_image_preview_2: true,
    }));
  };

  const handleFileChange3 = (event) => {
    console.log(event.target.files[0]);
  };

  const handleFileUploadSuccess3 = (url) => {
    setCheckpoint((prevCheckpoint) => ({
      ...prevCheckpoint,
      image_preview_link_3: url,
      has_image_preview_3: true,
    }));
  };

  const handleFileChange4 = (event) => {
    console.log(event.target.files[0]);
  };

  const handleFileUploadSuccess4 = (url) => {
    setCheckpoint((prevCheckpoint) => ({
      ...prevCheckpoint,
      image_preview_link_4: url,
      has_image_preview_4: true,
    }));
  };

  const handleFileChange5 = (event) => {
    console.log(event.target.files[0]);
  };

  const handleFileUploadSuccess5 = (url) => {
    setCheckpoint((prevCheckpoint) => ({
      ...prevCheckpoint,
      image_preview_link_5: url,
      has_image_preview_5: true,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
        !checkpointTemplateId ||
        !checkpoint.cc_audit_document_rating_option_id ||
        (checkpoint.has_image_preview_1 && !checkpoint.image_preview_link_1) ||
        (checkpoint.has_image_preview_2 && !checkpoint.image_preview_link_2) ||
        (checkpoint.has_image_preview_3 && !checkpoint.image_preview_link_3) ||
        (checkpoint.has_image_preview_4 && !checkpoint.image_preview_link_4) ||
        (checkpoint.has_image_preview_5 && !checkpoint.image_preview_link_5)
      ) {
        return console.log("Faltan campos por llenar");
      }
    setIsLoading(true);
    try {
      await addAuditDocumentCheckpoint(
        checkpointTemplateId,
        checkpoint.has_image_preview_1,
        checkpoint.has_image_preview_1 ? checkpoint.image_preview_link_1 : null,
        checkpoint.cc_audit_document_rating_option_id,
        checkpoint.cc_audit_document_id,
        checkpoint.description,
        checkpoint.has_image_preview_2,
        checkpoint.has_image_preview_2 ? checkpoint.image_preview_link_2 : null,
        checkpoint.has_image_preview_3,
        checkpoint.has_image_preview_3 ? checkpoint.image_preview_link_3 : null,
        checkpoint.has_image_preview_4,
        checkpoint.has_image_preview_4 ? checkpoint.image_preview_link_4 : null,
        checkpoint.has_image_preview_5,
        checkpoint.has_image_preview_5 ? checkpoint.image_preview_link_5 : null
      );
      showNotification("¡Punto de auditoría creado exitosamente!", "success");
      onCreate();
    } catch (error) {
      showNotification("Hubo un error, por favor intente de nuevo.", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="box-theme">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
        <SelectInput
          label="Calificación"
          name="cc_audit_document_rating_option_id"
          value={checkpoint.cc_audit_document_rating_option_id}
          required={true}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={ratingOptionsTable}
          columnName="name"
          idColumn="id"
        />

        <TextArea
          label="Comentarios adicionales"
          name="description"
          value={checkpoint.description}
          placeholder="Escribe aquí..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <div className="mt-4">
          <FileInput
            name="checkpointImage"
            onChange={handleFileChange}
            onUploadSuccess={handleFileUploadSuccess}
            showPreview={false}
          />
        </div>

        <div className="mt-4">
          <FileInput
            name="checkpointImage2"
            onChange={handleFileChange2}
            onUploadSuccess={handleFileUploadSuccess2}
            showPreview={false}
          />
        </div>

        <div className="mt-4">
          <FileInput
            name="checkpointImage3"
            onChange={handleFileChange3}
            onUploadSuccess={handleFileUploadSuccess3}
            showPreview={false}
          />
        </div>

        <div className="mt-4">
          <FileInput
            name="checkpointImage4"
            onChange={handleFileChange4}
            onUploadSuccess={handleFileUploadSuccess4}
            showPreview={false}
          />
        </div>

        <div className="mt-4">
          <FileInput
            name="checkpointImage5"
            onChange={handleFileChange5}
            onUploadSuccess={handleFileUploadSuccess5}
            showPreview={false}
          />
        </div>
      </div>

      <div className="mt-6">
        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Guardar
        </SubmitLoadingButton>
      </div>
    </form>
  );
}
