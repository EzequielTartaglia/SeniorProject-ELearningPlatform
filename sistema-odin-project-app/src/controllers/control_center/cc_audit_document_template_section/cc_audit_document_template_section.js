import supabase from "@/utils/supabase/supabaseClient";

export async function getAuditDocumentTemplateSections() {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_sections")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addAuditDocumentTemplateSection(
  name,
  description,
  cc_audit_document_template_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_sections")
      .insert({
        name: name,
        description: description,
        cc_audit_document_template_id: cc_audit_document_template_id,
      })
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error("Error trying to get section.");
    }

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentTemplateSection(
  cc_audit_document_template_section_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_sections")
      .select("*")
      .eq("id", cc_audit_document_template_section_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getAuditDocumentTemplateSectionsFromAuditDocumentTemplate(
  cc_audit_document_template_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_sections")
      .select("*")
      .eq("cc_audit_document_template_id", cc_audit_document_template_id);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error al obtener las secciones:", error.message);
    return [];
  }
}

export async function editAuditDocumentTemplateSection(
  cc_audit_document_template_section_id,
  name,
  description,
  cc_audit_document_template_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_sections")
      .update({
        name: name,
        description: description,
        cc_audit_document_template_id: cc_audit_document_template_id,
      })
      .eq("id", cc_audit_document_template_section_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteAuditDocumentTemplateSection(
  cc_audit_document_template_section_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_audit_document_template_sections")
      .delete()
      .eq("id", cc_audit_document_template_section_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
