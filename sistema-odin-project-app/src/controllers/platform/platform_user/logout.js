import supabase from "@/utils/supabase/supabaseClient";

export async function LogoutUserPlatform(platform_user_id) {
  try {
    const { data, error } = await supabase
      .from("platform_users")
      .update({
        is_active: false,
        token: null
      })
      .eq("id", platform_user_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

