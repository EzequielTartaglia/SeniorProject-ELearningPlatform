import supabase from "@/utils/supabase/supabaseClient";

export async function getCurrencyTypes() {
  try {
    const { data, error } = await supabase.from("currency_types").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addCurrencyType(
abbreviation,
name,
) {
  try {
    const { data, error } = await supabase
      .from("currency_types")
      .insert({
        abbreviation: abbreviation,
        name: name,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCurrencyType(currency_type_id) {
  try {
    const { data, error } = await supabase
      .from("currency_types")
      .select("*")
      .eq("id", currency_type_id)
      .single(); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching platform state:', error);
    throw error;
  }
}


export async function editCurrencyType(currency_type_id, abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("currency_types")
      .update({
        abbreviation: abbreviation,
        name: name,
      })
      .eq("id", currency_type_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCurrencyType(currency_type_id) {
  try {
    const { data, error } = await supabase
      .from("currency_types")
      .delete()
      .eq("id", currency_type_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

