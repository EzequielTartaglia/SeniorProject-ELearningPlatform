import supabase from "@/utils/supabase/supabaseClient";

export async function getAuditDocumentTemplateCheckpoints() {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoints")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentTemplateCheckpointsFromDocumentTemplate(
  cc_audit_document_template_id
) {
  try {
    if (!cc_audit_document_template_id) {
      throw new Error("Missing cc_audit_document_template_id");
    }

    let allData = [];
    let from = 0;
    const limit = 1000; 
    let data;
    let error;

    do {
      ({ data, error } = await supabase
        .from("cc_audit_document_template_checkpoints")
        .select("*")
        .eq("cc_audit_document_template_id", cc_audit_document_template_id)
        .range(from, from + limit - 1)); 

      if (error) {
        throw error;
      }

      if (data) {
        allData = [...allData, ...data];
      }

      from += limit;
    } while (data && data.length === limit); 

    if (allData.length === 0) {
      console.warn("No checkpoints found for this template ID.");
      return [];
    }

    return allData;
  } catch (error) {
    console.error(
      "Error fetching audit document template checkpoints:",
      error.message
    );
    throw error;
  }
}


export async function addAuditDocumentTemplateCheckpoint(
  title,
  description,
  cc_audit_document_template_id,
  cc_audit_document_template_checkpoint_type_id,
  cc_audit_document_template_section_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoints")
      .insert({
        title: title,
        description: description,
        cc_audit_document_template_id: cc_audit_document_template_id,
        cc_audit_document_template_checkpoint_type_id:
          cc_audit_document_template_checkpoint_type_id,
          cc_audit_document_template_section_id: cc_audit_document_template_section_id,
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("Error trying to get checkpoint.");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentTemplateCheckpoint(
  cc_audit_document_template_checkpoint_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoints")
      .select("*")
      .eq("id", cc_audit_document_template_checkpoint_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editAuditDocumentTemplateCheckpoint(
  cc_audit_document_template_checkpoint_id,
  title,
  description,
  cc_audit_document_template_id,
  cc_audit_document_template_checkpoint_type_id,
  cc_audit_document_template_section_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoints")
      .update({
        title: title,
        description: description,
        cc_audit_document_template_id: cc_audit_document_template_id,
        cc_audit_document_template_checkpoint_type_id:
          cc_audit_document_template_checkpoint_type_id,
          cc_audit_document_template_section_id: cc_audit_document_template_section_id,
      })
      .eq("id", cc_audit_document_template_checkpoint_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditDocumentTemplateCheckpoint(
  cc_audit_document_template_checkpoint_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_checkpoints")
      .delete()
      .eq("id", cc_audit_document_template_checkpoint_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
