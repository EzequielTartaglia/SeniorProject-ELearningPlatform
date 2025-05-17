import supabase from "@/utils/supabase/supabaseClient";

export async function getAuditDocumentTemplateCheckpointTypes() {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoint_types")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addAuditDocumentTemplateCheckpointType(
  title,
  description
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoint_types")
      .insert({
        title: title,
        description: description,
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("Error trying to get checkpoint type.");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentTemplateCheckpointType(
  cc_audit_document_template_checkpoint_type_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoint_types")
      .select("*")
      .eq("id", cc_audit_document_template_checkpoint_type_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editAuditDocumentTemplateCheckpointType(
  cc_audit_document_template_checkpoint_type_id,
  title,
  description
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoint_types")
      .update({ title: title, description: description })
      .eq("id", cc_audit_document_template_checkpoint_type_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditDocumentTemplateCheckpointType(
    cc_audit_document_template_checkpoint_type_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoint_types")
      .delete()
      .eq("id", cc_audit_document_template_checkpoint_type_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
