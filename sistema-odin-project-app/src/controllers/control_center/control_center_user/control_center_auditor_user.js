import supabase from "@/utils/supabase/supabaseClient";

export async function getControlCenterAuditorUsers() {
  try {
    const { data, error } = await supabase
      .from("cc_users")
      .select("*")
      .eq("cc_user_role_id", 1);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addControlCenterAuditorUser(
  first_name,
  last_name,
  cc_user_gender_id,
  phone,
  email,
  cc_country_id,
  dni_ssn,
  username,
  password,
  birthdate,
  cc_user_business_id,
  created_by_user_id
) {
  try {
    const { data, error } = await supabase.from("cc_users").insert({
      first_name: first_name,
      last_name: last_name,
      cc_user_gender_id: cc_user_gender_id,
      phone: phone,
      email: email,
      cc_country_id: cc_country_id,
      dni_ssn: dni_ssn,
      username: username,
      password: password,
      cc_user_role_id: 1,
      birthdate: birthdate,
      cc_user_business_id: cc_user_business_id,
      created_by_user_id: created_by_user_id,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getControlCenterAuditorUser(control_center_user_id) {
  try {
    const { data, error } = await supabase
      .from("cc_users")
      .select("*")
      .eq("id", control_center_user_id)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error fetching control center user:", error);
    throw error;
  }
}

export async function editControlCenterAuditorUser(
  control_center_user_id,
  first_name,
  last_name,
  cc_user_gender_id,
  phone,
  email,
  cc_country_id,
  dni_ssn,
  username,
  password,
  birthdate
) {
  try {
    const { data, error } = await supabase
      .from("cc_users")
      .update({
        first_name: first_name,
        last_name: last_name,
        cc_user_gender_id: cc_user_gender_id,
        phone: phone,
        email: email,
        cc_country_id: cc_country_id,
        dni_ssn: dni_ssn,
        username: username,
        password: password,
        birthdate: birthdate
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

export async function deleteControlCenterAuditorUser(control_center_user_id) {
  try {
    const { data, error } = await supabase
      .from("cc_users")
      .delete()
      .eq("id", control_center_user_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editControlCenterAuditorUserStatus(
  control_center_user_id,
  is_active
) {
  try {
    const { data, error } = await supabase
      .from("cc_users")
      .update({
        is_active: is_active,
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

export async function getControlCenterAuditorUsersActives() {
  try {
    const { data, error } = await supabase
      .from("cc_users")
      .select("*")
      .eq("is_active", true)
      .eq("cc_user_role_id", 1);
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
      .from("cc_users")
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
      .from("cc_users")
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
