import supabase from "@/utils/supabase/supabaseClient";

export async function getGlobalUserRoles() {
  try {
    const { data, error } = await supabase
      .from("global_user_roles")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addGlobalUserRole(name) {
  try {
    const { data, error } = await supabase.from("global_user_roles").insert({
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

export async function getGlobalUser(global_user_role_id) {
  try {
    const { data, error } = await supabase
      .from("global_user_roles")
      .select("*")
      .eq("id", global_user_role_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editGlobalUserRole(global_user_role_id, name) {
  try {
    const { data, error } = await supabase
      .from("global_user_roles")
      .update({
        name: name,
      })
      .eq("id", global_user_role_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteGlobalUserRole(global_user_role_id) {
  try {
    const { data, error } = await supabase
      .from("global_user_roles")
      .delete()
      .eq("id", global_user_role_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
