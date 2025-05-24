import supabase from "@/utils/supabase/supabaseClient";

export async function getGlobalUsers() {
  try {
    const { data, error } = await supabase.from("global_users").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addGlobalUser(
  first_name,
  last_name,
  phone,
  email,
  username,
  password
) {
  try {
    const { data, error } = await supabase
      .from("global_users")
      .insert({
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        username: username,
        password: password,
      });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getGlobalUser(global_user_id) {
  try {
    const { data, error } = await supabase
      .from("global_users")
      .select("*")
      .eq("id", global_user_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editGlobalUser(global_user_id, first_name, last_name, phone, email, username, password) {
  try {
    const { data, error } = await supabase
      .from("global_users")
      .update({
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        email: email,
        username: username,
        password: password,
      })
      .eq("id", global_user_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteGlobalUser(global_user_id) {
  try {
    const { data, error } = await supabase
      .from("global_users")
      .delete()
      .eq("id", global_user_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editGlobalUserStatus(global_user_id, is_active) {
  try {
    const { data, error } = await supabase
      .from("global_users")
      .update({
        is_active: is_active,
      })
      .eq("id", global_user_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getGlobalUsersActives() {
  try {
    const { data, error } = await supabase
      .from("global_users")
      .select("*")
      .eq("is_active", true);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}