import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformUserBusinesses() {
  try {
    const { data, error } = await supabase
      .from("platform_user_business")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformUserBusiness(
  name
) {
  try {
    const { data, error } = await supabase
      .from("platform_user_business")
      .insert({
        name: name
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPlatformUserBusiness(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_business")
      .select("*")
      .eq("id", platform_user_business_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching platform user:", error);
    throw error;
  }
}

export async function editPlatformUserBusiness(
  platform_user_business_id,
  name
) {
  try {
    const { data, error } = await supabase
      .from("platform_user_business")
      .update({
        name: name,
      })
      .eq("id", platform_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePlatformUserBusiness(platform_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("platform_user_business")
      .delete()
      .eq("id", platform_user_business_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
