import supabase from "@/utils/supabase/supabaseClient";

export async function getAuditDocuments() {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addAuditDocument(
  date,
  cc_audit_document_template_id,
  total_not_verified_points,
  total_implemented_points,
  total_partially_implemented_points,
  total_not_implemented_points,
  total_excluded_points,
  created_by_cc_user_id,
  cc_client_id,
  cc_state_id = 1,
  accessible_users = []
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .insert({
        date: date,
        cc_audit_document_template_id: cc_audit_document_template_id,
        total_not_verified_points: total_not_verified_points,
        total_implemented_points: total_implemented_points,
        total_partially_implemented_points: total_partially_implemented_points,
        total_not_implemented_points: total_not_implemented_points,
        total_excluded_points: total_excluded_points,
        created_by_cc_user_id: created_by_cc_user_id,
        cc_client_id: cc_client_id,
        cc_state_id: cc_state_id,
        accessible_users: accessible_users,
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("No se pudo obtener el registro creado.");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocument(cc_audit_document_id) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .select("*")
      .eq("id", cc_audit_document_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editAuditDocument(
  cc_audit_document_id,
  date,
  cc_audit_document_template_id,
  total_not_verified_points,
  total_implemented_points,
  total_partially_implemented_points,
  total_not_implemented_points,
  total_excluded_points,
  created_by_cc_user_id,
  cc_client_id,
  cc_state_id = 1,
  accessible_users = []

) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .update({
        date: date,
        cc_audit_document_template_id: cc_audit_document_template_id,
        total_not_verified_points: total_not_verified_points,
        total_implemented_points: total_implemented_points,
        total_partially_implemented_points: total_partially_implemented_points,
        total_not_implemented_points: total_not_implemented_points,
        total_excluded_points: total_excluded_points,
        created_by_cc_user_id: created_by_cc_user_id,
        cc_client_id: cc_client_id,
        cc_state_id: cc_state_id,
        accessible_users: accessible_users,

      })
      .eq("id", cc_audit_document_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditDocument(cc_audit_document_id) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .delete()
      .eq("id", cc_audit_document_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changeStateToIncomplete(cc_audit_document_id) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .update({ cc_state_id: 5 })
      .eq("id", cc_audit_document_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function changeStateToComplete(cc_audit_document_id) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .update({ cc_state_id: 4 })
      .eq("id", cc_audit_document_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentsByBusiness(cc_user_business_id) {
  if (!cc_user_business_id) {
    throw new Error("El ID de la empresa es requerido");
  }

  try {
    const { data: users, error: userError } = await supabase
      .from("cc_users")
      .select("id")
      .eq("cc_user_business_id", cc_user_business_id);

    if (userError) {
      throw userError;
    }

    if (!users || users.length === 0) {
      throw new Error(
        "No se encontraron usuarios para la empresa proporcionada"
      );
    }

    const userIds = users.map((user) => user.id);

    const { data: videos, error: videoError } = await supabase
      .from("cc_audit_documents")
      .select("*")
      .in("created_by_cc_user_id", userIds);

    if (videoError) {
      throw videoError;
    }

    return videos || [];
  } catch (error) {
    console.error("Error al obtener videos de tratamiento:", error.message);
    throw error;
  }
}

export async function getClientsByBusiness(cc_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .select(
        `
        cc_client_id,
        cc_audit_document_templates!inner(cc_user_business_id)
      `
      )
      .eq(
        "cc_audit_document_templates.cc_user_business_id",
        cc_user_business_id
      );

    if (error) {
      throw error;
    }

    const uniqueClientIds = [...new Set(data.map((item) => item.cc_client_id))];

    return uniqueClientIds;
  } catch (error) {
    throw error;
  }
}

export async function updateNotVerifiedPoints(cc_audit_document_id) {
  try {
    if (!cc_audit_document_id) {
      throw new Error("El ID del documento de auditoría es inválido.");
    }

    const { data, error, count } = await supabase
      .from("cc_audit_document_checkpoints")
      .select("*", { count: "exact" })
      .eq("cc_audit_document_rating_option_id", 1)
      .eq("cc_audit_document_id", cc_audit_document_id);

    if (error) {
      console.error("Error al obtener los puntos optimizados:", error.message);
      throw error;
    }

    const totalNotVerifiedPoints = count || 0; // Usamos el conteo exacto

    const { error: updateError } = await supabase
      .from("cc_audit_documents")
      .update({
        total_not_verified_points: totalNotVerifiedPoints,
      })
      .eq("id", cc_audit_document_id);

    if (updateError) {
      console.error("Error al actualizar el documento:", updateError.message);
      throw updateError;
    }
    return totalNotVerifiedPoints;
  } catch (error) {
    console.error("Error en el proceso de actualización:", error.message);
    throw error;
  }
}

export async function updateImplementedPoints(cc_audit_document_id) {
  try {
    if (!cc_audit_document_id) {
      throw new Error("El ID del documento de auditoría es inválido.");
    }

    const { data, error, count } = await supabase
      .from("cc_audit_document_checkpoints")
      .select("*", { count: "exact" })
      .eq("cc_audit_document_rating_option_id", 2)
      .eq("cc_audit_document_id", cc_audit_document_id);

    if (error) {
      console.error("Error al obtener los puntos correctos:", error.message);
      throw error;
    }

    const totalImplementedPoints = count || 0;

    const { error: updateError } = await supabase
      .from("cc_audit_documents")
      .update({
        total_implemented_points: totalImplementedPoints,
      })
      .eq("id", cc_audit_document_id);

    if (updateError) {
      console.error("Error al actualizar el documento:", updateError.message);
      throw updateError;
    }

    return totalImplementedPoints;
  } catch (error) {
    console.error("Error en el proceso de actualización:", error.message);
    throw error;
  }
}

export async function updatePartiallyImplementedPoints(cc_audit_document_id) {
  try {
    if (!cc_audit_document_id) {
      throw new Error("El ID del documento de auditoría es inválido.");
    }

    const { data, error, count } = await supabase
      .from("cc_audit_document_checkpoints")
      .select("*", { count: "exact" })
      .eq("cc_audit_document_rating_option_id", 3)
      .eq("cc_audit_document_id", cc_audit_document_id);

    if (error) {
      console.error("Error al obtener los puntos regulares:", error.message);
      throw error;
    }

    const totalPartiallyImplementedPoints = count || 0;

    const { error: updateError } = await supabase
      .from("cc_audit_documents")
      .update({
        total_partially_implemented_points: totalPartiallyImplementedPoints,
      })
      .eq("id", cc_audit_document_id);

    if (updateError) {
      console.error("Error al actualizar el documento:", updateError.message);
      throw updateError;
    }
    return totalPartiallyImplementedPoints;
  } catch (error) {
    console.error("Error en el proceso de actualización:", error.message);
    throw error;
  }
}

export async function updateNotImplementedPoints(cc_audit_document_id) {
  try {
    if (!cc_audit_document_id) {
      throw new Error("El ID del documento de auditoría es inválido.");
    }

    const { data, error, count } = await supabase
      .from("cc_audit_document_checkpoints")
      .select("*", { count: "exact" })
      .eq("cc_audit_document_rating_option_id", 4)
      .eq("cc_audit_document_id", cc_audit_document_id);

    if (error) {
      console.error("Error al obtener los puntos bajos:", error.message);
      throw error;
    }

    const totalNotImplementedPoints = count || 0;

    const { error: updateError } = await supabase
      .from("cc_audit_documents")
      .update({
        total_not_implemented_points: totalNotImplementedPoints,
      })
      .eq("id", cc_audit_document_id);

    if (updateError) {
      console.error("Error al actualizar el documento:", updateError.message);
      throw updateError;
    }

    return totalNotImplementedPoints;
  } catch (error) {
    console.error("Error en el proceso de actualización:", error.message);
    throw error;
  }
}

export async function updateExcludedPoints(cc_audit_document_id) {
  try {
    if (!cc_audit_document_id) {
      throw new Error("El ID del documento de auditoría es inválido.");
    }

    const { data, error, count } = await supabase
      .from("cc_audit_document_checkpoints")
      .select("*", { count: "exact" })
      .eq("cc_audit_document_rating_option_id", 5)
      .eq("cc_audit_document_id", cc_audit_document_id);

    if (error) {
      console.error("Error al obtener los puntos correctos:", error.message);
      throw error;
    }

    const totalExcludedPoints = count || 0;

    const { error: updateError } = await supabase
      .from("cc_audit_documents")
      .update({
        total_excluded_points: totalExcludedPoints,
      })
      .eq("id", cc_audit_document_id);

    if (updateError) {
      console.error("Error al actualizar el documento:", updateError.message);
      throw updateError;
    }

    return totalExcludedPoints;
  } catch (error) {
    console.error("Error en el proceso de actualización:", error.message);
    throw error;
  }
}

export async function updateAllPoints(cc_audit_document_id) {
  try {
    if (!cc_audit_document_id) {
      throw new Error("El ID del documento de auditoría es inválido.");
    }

    // Primero, actualizar los puntos optimizados
    const totalNotVerifiedPoints = await updateNotVerifiedPoints(
      cc_audit_document_id
    );

    // Luego, actualizar los puntos correctos
    const totalImplementedPoints = await updateImplementedPoints(
      cc_audit_document_id
    );

    // Luego, actualizar los puntos regulares
    const totalPartiallyImplementedPoints =
      await updatePartiallyImplementedPoints(cc_audit_document_id);

    // Luego, actualizar los puntos bajos
    const totalNotImplementedPoints = await updateNotImplementedPoints(
      cc_audit_document_id
    );

    // Luego, actualizar los puntos bajos
    const totalExcludedPoints = await updateExcludedPoints(
      cc_audit_document_id
    );
  } catch (error) {
    console.error("Error en el proceso de actualización:", error.message);
    throw error;
  }
}

export async function editAuditDocumentFinalComments(
  cc_audit_document_id,
  final_comments
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_documents")
      .update({
        final_comments: final_comments,
      })
      .eq("id", cc_audit_document_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
