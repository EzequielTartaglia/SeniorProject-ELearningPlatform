import supabase from "@/utils/supabase/supabaseClient";

export async function getStockProviders() {
  try {
    const { data, error } = await supabase.from("cc_stock_providers").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getStockProvidersFromBusiness(created_by_cc_user_business_id) {
  try {
    const { data, error } = await supabase.from("cc_stock_providers").select("*").eq("created_by_cc_user_business_id", created_by_cc_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addStockProvider(
  name,
  description,
  created_by_cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_providers")
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

export async function getStockProvider(cc_stock_provider_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_providers")
      .select("*")
      .eq("id", cc_stock_provider_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editStockProvider(
  cc_stock_provider_id,
  name,
  description,
  created_by_cc_user_business_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_providers")
      .update({
        name: name,
        description: description,
        created_by_cc_user_business_id: created_by_cc_user_business_id,
      })
      .eq("id", cc_stock_provider_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteStockProvider(cc_stock_provider_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_providers")
      .delete()
      .eq("id", cc_stock_provider_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
