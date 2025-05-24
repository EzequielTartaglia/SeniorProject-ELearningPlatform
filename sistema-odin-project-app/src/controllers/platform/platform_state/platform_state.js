import supabase from "@/utils/supabase/supabaseClient";

export async function getPlatformStates() {
  try {
    const { data, error } = await supabase.from("platform_states").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPlatformState(
name
) {
  try {
    const { data, error } = await supabase
      .from("platform_states")
      .insert({
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

export async function getPlatformState(platform_state_id) {
  try {
    const { data, error } = await supabase
      .from("platform_states")
      .select("*")
      .eq("id", parseInt(platform_state_id))
      .single(); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching platform state:', error);
    throw error;
  }
}


export async function editPlatformState(platform_state_id, name) {
  try {
    const { data, error } = await supabase
      .from("platform_states")
      .update({
        name: name,
      })
      .eq("id", platform_state_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePlatformState(platform_state_id) {
  try {
    const { data, error } = await supabase
      .from("platform_states")
      .delete()
      .eq("id", platform_state_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

