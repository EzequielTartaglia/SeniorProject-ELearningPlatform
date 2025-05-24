import supabase from "@/utils/supabase/supabaseClient";

export async function getCountries() {
  try {
    const { data, error } = await supabase.from("countries").select("*");
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
      .from("countries")
      .insert({ abbreviation: abbreviation, name: name });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getCountry(country_id) {
  try {
    const { data, error } = await supabase
      .from("countries")
      .select("*")
      .eq("id", country_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editCountry(country_id, abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("countries")
      .update({ abbreviation: abbreviation, name: name })
      .eq("id", country_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteCountry(country_id) {
  try {
    const { data, error } = await supabase
      .from("countries")
      .delete()
      .eq("id", country_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
