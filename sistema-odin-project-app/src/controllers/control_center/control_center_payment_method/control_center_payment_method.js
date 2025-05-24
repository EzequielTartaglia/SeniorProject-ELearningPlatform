import supabase from "@/utils/supabase/supabaseClient";

export async function getPaymentMethods() {
  try {
    const { data, error } = await supabase.from("cc_payment_methods").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addPaymentMethod(
name
) {
  try {
    const { data, error } = await supabase
      .from("cc_payment_methods")
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

export async function getPaymentMethod(control_center_payment_method_id) {
  try {
    const { data, error } = await supabase
      .from("cc_payment_methods")
      .select("*")
      .eq("id", parseInt(control_center_payment_method_id))
      .single(); 

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching control center payment method:', error);
    throw error;
  }
}


export async function editPaymentMethod(control_center_payment_method_id, name) {
  try {
    const { data, error } = await supabase
      .from("cc_payment_methods")
      .update({
        name: name,
      })
      .eq("id", control_center_payment_method_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePaymentMethod(control_center_payment_method_id) {
  try {
    const { data, error } = await supabase
      .from("cc_payment_methods")
      .delete()
      .eq("id", control_center_payment_method_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

