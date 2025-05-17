import supabase from "@/utils/supabase/supabaseClient";

export async function getAuditDocumentCheckpoints() {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_checkpoints")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentCheckpointsFromAuditDocument(cc_audit_document_id) {
  try {
    let allData = [];
    let from = 0;
    const limit = 1000;
    let data;
    let error;

    do {
      ({ data, error } = await supabase
        .from("cc_audit_document_checkpoints")
        .select("*")
        .eq("cc_audit_document_id", cc_audit_document_id)
        .range(from, from + limit - 1)); 
      
      if (error) {
        throw error;
      }

      if (data) {
        allData = [...allData, ...data];
      }

      from += limit;
    } while (data && data.length === limit); 

    return allData;
  } catch (error) {
    throw error;
  }
}


export async function addAuditDocumentCheckpoint(
  cc_audit_document_template_checkpoint_id,
  has_image_preview_1,
  image_preview_link_1,
  cc_audit_document_rating_option_id,
  cc_audit_document_id,
  description,
  has_image_preview_2,
  image_preview_link_2,
  has_image_preview_3,
  image_preview_link_3,
  has_image_preview_4,
  image_preview_link_4,
  has_image_preview_5,
  image_preview_link_5,
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_checkpoints")
      .insert({
        cc_audit_document_template_checkpoint_id:
          cc_audit_document_template_checkpoint_id,
        has_image_preview_1: has_image_preview_1,
        image_preview_link_1: image_preview_link_1,
        has_image_preview_2: has_image_preview_2,
        image_preview_link_2: image_preview_link_2,
        has_image_preview_3: has_image_preview_3,
        image_preview_link_3: image_preview_link_3,
        has_image_preview_4: has_image_preview_4,
        image_preview_link_4: image_preview_link_4,
        has_image_preview_5: has_image_preview_5,
        image_preview_link_5: image_preview_link_5,
        cc_audit_document_rating_option_id: cc_audit_document_rating_option_id,
        cc_audit_document_id: cc_audit_document_id,
        description: description,
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

export async function getAuditDocumentCheckpoint(
  cc_audit_document_checkpoint_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_checkpoints")
      .select("*")
      .eq("id", cc_audit_document_checkpoint_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editAuditDocumentCheckpoint(
  cc_audit_document_checkpoint_id,
  cc_audit_document_template_checkpoint_id,
  has_image_preview_1,
  image_preview_link_1,
  cc_audit_document_rating_option_id,
  cc_audit_document_id,
  description,
  has_image_preview_2,
  image_preview_link_2,
  has_image_preview_3,
  image_preview_link_3,
  has_image_preview_4,
  image_preview_link_4,
  has_image_preview_5,
  image_preview_link_5,
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_checkpoints")
      .update({
        cc_audit_document_template_checkpoint_id:
          cc_audit_document_template_checkpoint_id,
        has_image_preview_1: has_image_preview_1,
        image_preview_link_1: image_preview_link_1,
        has_image_preview_2: has_image_preview_2,
        image_preview_link_2: image_preview_link_2,
        has_image_preview_3: has_image_preview_3,
        image_preview_link_3: image_preview_link_3,
        has_image_preview_4: has_image_preview_4,
        image_preview_link_4: image_preview_link_4,
        has_image_preview_5: has_image_preview_5,
        image_preview_link_5: image_preview_link_5,
        cc_audit_document_rating_option_id: cc_audit_document_rating_option_id,
        cc_audit_document_id: cc_audit_document_id,
        description: description,
      })
      .eq("id", cc_audit_document_checkpoint_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditDocumentCheckpoint(
  cc_audit_document_checkpoint_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_checkpoints")
      .delete()
      .eq("id", cc_audit_document_checkpoint_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editAuditDocumentCheckpointDescription(
  cc_audit_document_checkpoint_id,
  description
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_checkpoints")
      .update({
        description: description,
      })
      .eq("id", cc_audit_document_checkpoint_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
