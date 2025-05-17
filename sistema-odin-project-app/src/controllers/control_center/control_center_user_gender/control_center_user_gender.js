import supabase from "@/utils/supabase/supabaseClient";

export async function getControlCenterUserGenders() {
  try {
    const { data, error } = await supabase.from("cc_user_genders").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addControlCenterUserGenders(abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("cc_user_genders")
      .insert({ abbreviation: abbreviation, name: name });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getControlCenterUserGender(cc_user_gender_id) {
  try {
    const { data, error } = await supabase
      .from("cc_user_genders")
      .select("*")
      .eq("id", cc_user_gender_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editControlCenterUserGender(cc_user_gender_id, abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("cc_user_genders")
      .update({ abbreviation: abbreviation, name: name })
      .eq("id", cc_user_gender_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteControlCenterUserGender(cc_user_gender_id) {
  try {
    const { data, error } = await supabase
      .from("cc_user_genders")
      .delete()
      .eq("id", cc_user_gender_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
