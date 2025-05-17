import supabase from "@/utils/supabase/supabaseClient";

export async function getAuditDocumentRatingOptions() {
    try {
      const { data, error } = await supabase
        .from("cc_audit_document_rating_options")
        .select("*");
      if (error) {
        console.error("Error al obtener las opciones:", error);
        throw error;
      }
      return data;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }
  

export async function addAuditDocumentTemplate(name) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_rating_options")
      .insert({
        name: name,
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

export async function getAuditDocumentRatingOption(
  cc_audit_document_rating_option_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_rating_options")
      .select("*")
      .eq("id", cc_audit_document_rating_option_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editAuditDocumentRatingOption(
  cc_audit_document_rating_option_id,
  name
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_rating_options")
      .update({ name: name })
      .eq("id", cc_audit_document_rating_option_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditDocumentTemplate(
  cc_audit_document_rating_option_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_rating_options")
      .delete()
      .eq("id", cc_audit_document_rating_option_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
