import supabase from "@/utils/supabase/supabaseClient";

export async function getControlCenterSetting(control_center_setting_id = 1) {
  try {
    const { data, error } = await supabase
      .from("cc_settings")
      .select("*")
      .eq("id", control_center_setting_id)
      .single(); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching control center settings:', error);
    throw error;
  }
}

export async function editControlCenterSettings(contact_number, control_center_setting_id = 1) {
  try {
    const { data, error } = await supabase
      .from("cc_settings")
      .update({
        contact_number: contact_number,
      })
      .eq("id", control_center_setting_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error updating control center settings:', error);
    throw error;
  }
}
