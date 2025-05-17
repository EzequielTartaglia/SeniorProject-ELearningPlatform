import supabase from "@/utils/supabase/supabaseClient";

export async function getPaymentMethods() {
  try {
    const { data, error } = await supabase.from("payment_methods").select("*");
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
      .from("payment_methods")
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

export async function getPaymentMethod(payment_method_id) {
  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .eq("id", parseInt(payment_method_id))
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


export async function editPaymentMethod(payment_method_id, name) {
  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .update({
        name: name,
      })
      .eq("id", payment_method_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deletePaymentMethod(payment_method_id) {
  try {
    const { data, error } = await supabase
      .from("payment_methods")
      .delete()
      .eq("id", payment_method_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

