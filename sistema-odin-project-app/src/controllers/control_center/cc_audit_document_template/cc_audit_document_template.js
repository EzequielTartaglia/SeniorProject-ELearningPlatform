import supabase from "@/utils/supabase/supabaseClient";

export async function getAuditDocumentTemplates() {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_templates")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addAuditDocumentTemplate(
  title,
  description,
  cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_templates")
      .insert({
        title: title,
        description: description,
        cc_user_business_id: cc_user_business_id,
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

export async function getAuditDocumentTemplate(cc_audit_document_template_id) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_templates")
      .select("*")
      .eq("id", cc_audit_document_template_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentTemplatesFromBusiness(
  cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_templates")
      .select("*")
      .eq("cc_user_business_id", cc_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editAuditDocumentTemplate(
  cc_audit_document_template_id,
  title,
  description
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_templates")
      .update({ title: title, description: description })
      .eq("id", cc_audit_document_template_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditDocumentTemplate(
  cc_audit_document_template_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_templates")
      .delete()
      .eq("id", cc_audit_document_template_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function isAuditDocumentTemplateFromBusiness(cc_audit_document_template_id, cc_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_templates")
      .select("cc_user_business_id")
      .eq("id", cc_audit_document_template_id)
      .single();

    if (error) {
      throw error;
    }

    return data.cc_user_business_id === cc_user_business_id;
  } catch (error) {
    throw error;
  }
}
