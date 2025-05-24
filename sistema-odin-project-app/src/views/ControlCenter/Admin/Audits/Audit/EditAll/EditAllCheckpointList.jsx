import React, { useState } from "react";
import EditAllCheckpointCard from "./EditAllCheckpointCard";

const EditAllCheckpointList = ({
  checkpoints,
  checkpointsAnswers,
  controlCenterAuditDocumentId,
  ratingOptionsTable,
  typesTable,
  isEditable,
}) => {
  const [showImageFor, setShowImageFor] = useState(null);
  const [editingCheckpointId, setEditingCheckpointId] = useState(null);
  const [creatingCheckpointId, setCreatingCheckpointId] = useState(null);

  const toggleImageVisibility = (checkpointId) => {
    setShowImageFor((prev) => (prev === checkpointId ? null : checkpointId));
  };

  const handleEdit = (checkpointId) => {
    setEditingCheckpointId((prev) =>
      prev === checkpointId ? null : checkpointId
    );
  };

  const handleCreate = (checkpointId) => {
    setCreatingCheckpointId((prev) =>
      prev === checkpointId ? null : checkpointId
    );
  };
  
  return (
    <div>
      {checkpoints.map((checkpoint) => {
        const answer = checkpointsAnswers.find(
          (item) =>
            item.cc_audit_document_template_checkpoint_id === checkpoint.id
        );

        const ratingOptionName =
          ratingOptionsTable.find(
            (option) => option.id === answer?.cc_audit_document_rating_option_id
          )?.name || "Sin respuesta";

        const typeName =
          typesTable.find(
            (type) =>
              type.id ===
              checkpoint?.cc_audit_document_template_checkpoint_type_id
          )?.name || "Sin respuesta";

        return (
          <EditAllCheckpointCard
            key={checkpoint.id}
            checkpoint={checkpoint}
            checkpointsAnswers={checkpointsAnswers}
            index={checkpointsAnswers.indexOf(answer)}
            ratingOptionName={ratingOptionName}
            typeName={typeName}
            description={answer?.description}
            controlCenterAuditDocumentId={controlCenterAuditDocumentId}
            showImage={showImageFor === checkpoint.id}
            showForm={editingCheckpointId === checkpoint.id}
            showFormCreate={creatingCheckpointId === checkpoint.id}
            onEdit={() => handleEdit(checkpoint.id)}
            onCreate={() => handleCreate(checkpoint.id)}
            toggleImageVisibility={() => toggleImageVisibility(checkpoint.id)}
            isEditable={isEditable}
          />
        );
      })}
    </div>
  );
};

export default EditAllCheckpointList;
