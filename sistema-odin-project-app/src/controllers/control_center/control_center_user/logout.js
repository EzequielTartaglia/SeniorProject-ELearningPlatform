import supabase from "@/utils/supabase/supabaseClient";

export async function LogoutControlCenterUser(control_center_user_id) {
  try {
    const { data, error } = await supabase
      .from("cc_users")
      .update({
        is_active: false,
        token: null
      })
      .eq("id", control_center_user_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

