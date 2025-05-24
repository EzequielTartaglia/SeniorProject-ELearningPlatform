import supabase from "@/utils/supabase/supabaseClient";

export async function getControlCenterUserBusinesses() {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addControlCenterUserBusiness(
  name
) {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
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

export async function addControlCenterUserBusinessEnabledPlugins(
  control_center_user_business_id,
  enabled_plugins
) {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
      .update({
        enabled_plugins: enabled_plugins,
      })
      .eq("id", control_center_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getControlCenterUserBusiness(control_center_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
      .select("*")
      .eq("id", control_center_user_business_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching control_center user:", error);
    throw error;
  }
}

export async function getControlCenterUserBusinessEnabledPluggins(control_center_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
      .select("enabled_plugins") 
      .eq("id", control_center_user_business_id)
      .single(); 

    if (error) {
      throw error;
    }
    return data?.enabled_plugins || []; 
  } catch (error) {
    console.error("Error fetching control_center user:", error);
    throw error;
  }
}


export async function editControlCenterUserBusiness(
  control_center_user_business_id,
  name
) {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
      .update({
        name: name,
      })
      .eq("id", control_center_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editControlCenterUserBusinessEnabledPlugins(
  control_center_user_business_id,
  enabled_plugins
) {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
      .update({
        enabled_plugins: enabled_plugins,
      })
      .eq("id", control_center_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteControlCenterUserBusiness(control_center_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_user_businesses")
      .delete()
      .eq("id", control_center_user_business_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}