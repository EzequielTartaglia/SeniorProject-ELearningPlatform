import supabase from "@/utils/supabase/supabaseClient";

export async function getCountries() {
  try {
    const { data, error } = await supabase.from("cc_countries").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addCountry(abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("cc_countries")
      .insert({ abbreviation: abbreviation, name: name });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCountry(cc_country_id) {
  try {
    const { data, error } = await supabase
      .from("cc_countries")
      .select("*")
      .eq("id", cc_country_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCountry(cc_country_id, abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("cc_countries")
      .update({ abbreviation: abbreviation, name: name })
      .eq("id", cc_country_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCountry(cc_country_id) {
  try {
    const { data, error } = await supabase
      .from("cc_countries")
      .delete()
      .eq("id", cc_country_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
