import supabase from "@/utils/supabase/supabaseClient";

export async function getStockClients() {
  try {
    const { data, error } = await supabase.from("cc_stock_clients").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addStockClient(
  name,
  description,
  created_by_cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_clients")
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

export async function getStockClient(cc_stock_client_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_clients")
      .select("*")
      .eq("id", cc_stock_client_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editStockClient(
  cc_stock_client_id,
  name,
  description,
  created_by_cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_clients")
      .update({
        name: name,
        description: description,
        created_by_cc_user_business_id: created_by_cc_user_business_id,
      })
      .eq("id", cc_stock_client_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteStockClient(cc_stock_client_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_clients")
      .delete()
      .eq("id", cc_stock_client_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
