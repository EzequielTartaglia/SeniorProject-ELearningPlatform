import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformUsers() {
  try {
    const { data, error } = await supabase.from("platform_users").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformUser(
  first_name,
  last_name,
  platform_user_gender_id,
  phone,
  email,
  country_id,
  dni_ssn,
  username,
  password,
  user_role_id,
  birthdate
) {
  try {
    const { data, error } = await supabase.from("platform_users").insert({
      first_name: first_name,
      last_name: last_name,
      platform_user_gender_id: platform_user_gender_id,
      phone: phone,
      email: email,
      country_id: country_id,
      dni_ssn: dni_ssn,
      username: username,
      password: password,
      user_role_id: user_role_id,
      birthdate: birthdate,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getPlatformUser(platform_user_id) {
  try {
    const { data, error } = await supabase
      .from("platform_users")
      .select("*")
      .eq("id", platform_user_id)
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

export async function editPlatformUser(
  platform_user_id,
  first_name,
  last_name,
  platform_user_gender_id,
  phone,
  email,
  country_id,
  dni_ssn,
  username,
  password,
  user_role_id,
  birthdate
) {
  try {
    const { data, error } = await supabase
      .from("platform_users")
      .update({
        first_name: first_name,
        last_name: last_name,
        platform_user_gender_id: platform_user_gender_id,
        phone: phone,
        email: email,
        country_id: country_id,
        dni_ssn: dni_ssn,
        username: username,
        password: password,
        user_role_id: user_role_id,
        birthdate: birthdate,
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

export async function deletePlatformUser(platform_user_id) {
  try {
    const { data, error } = await supabase
      .from("platform_users")
      .delete()
      .eq("id", platform_user_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editPlatformUserStatus(platform_user_id, is_active) {
  try {
    const { data, error } = await supabase
      .from("platform_users")
      .update({
        is_active: is_active,
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

export async function getPlatformUsersActives() {
  try {
    const { data, error } = await supabase
      .from("platform_users")
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

export async function checkEmailExists(email) {
  try {
    const { data, error } = await supabase
      .from("platform_users")
      .select("id")
      .eq("email", email);

    if (error) {
      throw error;
    }

    return data.length > 0;
  } catch (error) {
    console.error("Error checking email:", error);
    throw error;
  }
}

export async function changeUserPassword(
  user_id,
  currentPassword,
  newPassword
) {
  try {
    const { data: user, error: fetchError } = await supabase
      .from("platform_users")
      .select("id, password")
      .eq("id", user_id)
      .eq("password", currentPassword)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    // Si el usuario no existe
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const { error: updateError } = await supabase
      .from("platform_users")
      .update({ password: newPassword })
      .eq("id", user_id);

    if (updateError) {
      throw updateError;
    }

    return true;
  } catch (error) {
    console.error("Error al cambiar la contraseña:", error.message);
    throw error;
  }
}
