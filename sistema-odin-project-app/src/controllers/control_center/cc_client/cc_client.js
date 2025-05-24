import supabase from "@/utils/supabase/supabaseClient";

export async function getClients() {
  try {
    const { data, error } = await supabase.from("cc_clients").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addClient(
  name,
  description,
  created_by_cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_clients")
      .insert({
        name: name,
        description: description,
        created_by_cc_user_business_id: created_by_cc_user_business_id,
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

export async function getClient(cc_client_id) {
  try {
    const { data, error } = await supabase
      .from("cc_clients")
      .select("*")
      .eq("id", cc_client_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editClient(
  cc_client_id,
  name,
  description,
  created_by_cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_clients")
      .update({
        name: name,
        description: description,
        created_by_cc_user_business_id: created_by_cc_user_business_id,
      })
      .eq("id", cc_client_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteClient(cc_client_id) {
  try {
    const { data, error } = await supabase
      .from("cc_clients")
      .delete()
      .eq("id", cc_client_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
