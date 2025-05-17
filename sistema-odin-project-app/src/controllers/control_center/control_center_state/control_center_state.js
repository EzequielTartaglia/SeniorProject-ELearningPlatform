import supabase from "@/utils/supabase/supabaseClient";

export async function getControlCenterStates() {
  try {
    const { data, error } = await supabase.from("cc_states").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addControlCenterState(
name
) {
  try {
    const { data, error } = await supabase
      .from("cc_states")
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

export async function getControlCenterState(control_center_state_id) {
  try {
    const { data, error } = await supabase
      .from("cc_states")
      .select("*")
      .eq("id", parseInt(control_center_state_id))
      .single(); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching control center state:', error);
    throw error;
  }
}


export async function editControlCenterState(control_center_state_id, name) {
  try {
    const { data, error } = await supabase
      .from("cc_states")
      .update({
        name: name,
      })
      .eq("id", control_center_state_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteControlCenterState(control_center_state_id) {
  try {
    const { data, error } = await supabase
      .from("cc_states")
      .delete()
      .eq("id", control_center_state_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

