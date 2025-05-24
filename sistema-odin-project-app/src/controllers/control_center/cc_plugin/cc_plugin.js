import supabase from "@/utils/supabase/supabaseClient";

export async function getControlCenterPlugins() {
  try {
    const { data, error } = await supabase.from("cc_plugins").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addControlCenterPlugin(name, description) {
  try {
    const { data, error } = await supabase.from("cc_plugins").insert({
      name: name,
      description: description,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getControlCenterPlugin(cc_plugin_id) {
  try {
    const { data, error } = await supabase
      .from("cc_plugins")
      .select("*")
      .eq("id", cc_plugin_id)
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

export async function editControlCenterPlugin(cc_plugin_id, name, description) {
  try {
    const { data, error } = await supabase
      .from("cc_plugins")
      .update({
        name: name,
        description: description,
      })
      .eq("id", cc_plugin_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteControlCenterPlugin(cc_plugin_id) {
  try {
    const { data, error } = await supabase
      .from("cc_plugins")
      .delete()
      .eq("id", cc_plugin_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
