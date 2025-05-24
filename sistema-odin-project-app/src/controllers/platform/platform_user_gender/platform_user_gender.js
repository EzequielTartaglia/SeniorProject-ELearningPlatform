import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformUserGenders() {
  try {
    const { data, error } = await supabase.from("platform_user_genders").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformUserGenders(abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("platform_user_genders")
      .insert({ abbreviation: abbreviation, name: name });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPlatformUserGender(platform_user_gender_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_genders")
      .select("*")
      .eq("id", platform_user_gender_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editPlatformUserGender(platform_user_gender_id, abbreviation, name) {
  try {
    const { data, error } = await supabase
      .from("platform_user_genders")
      .update({ abbreviation: abbreviation, name: name })
      .eq("id", platform_user_gender_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePlatformUserGender(platform_user_gender_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_genders")
      .delete()
      .eq("id", platform_user_gender_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
