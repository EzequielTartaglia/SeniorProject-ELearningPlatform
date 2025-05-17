import supabase from "@/utils/supabase/supabaseClient";

export async function getCurrencyTypes() {
  try {
    const { data, error } = await supabase.from("cc_currency_types").select("*");
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
      .from("cc_currency_types")
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

export async function getCurrencyType(control_center_currency_type_id) {
  try {
    const { data, error } = await supabase
      .from("cc_currency_types")
      .select("*")
      .eq("id", control_center_currency_type_id)
      .single(); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching control center state:', error);
    throw error;
  }
}


export async function editCurrencyType(control_center_currency_type_id, abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("cc_currency_types")
      .update({
        abbreviation: abbreviation,
        name: name,
      })
      .eq("id", control_center_currency_type_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCurrencyType(control_center_currency_type_id) {
  try {
    const { data, error } = await supabase
      .from("cc_currency_types")
      .delete()
      .eq("id", control_center_currency_type_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

