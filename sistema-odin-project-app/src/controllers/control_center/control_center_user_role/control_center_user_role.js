import supabase from "@/utils/supabase/supabaseClient";

export async function getControlCenterUserRoles() {
  try {
    const { data, error } = await supabase
      .from("cc_user_roles")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addControlCenterUserRole(name) {
  try {
    const { data, error } = await supabase.from("cc_user_roles").insert({
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

export async function getControlCenterUserRole(cc_user_role_id) {
  try {
    const { data, error } = await supabase
      .from("cc_user_roles")
      .select("*")
      .eq("id", cc_user_role_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editControlCenterUserRole(cc_user_role_id, name) {
  try {
    const { data, error } = await supabase
      .from("cc_user_roles")
      .update({
        name: name,
      })
      .eq("id", cc_user_role_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteControlCenterUserRole(cc_user_role_id) {
  try {
    const { data, error } = await supabase
      .from("cc_user_roles")
      .delete()
      .eq("id", cc_user_role_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
