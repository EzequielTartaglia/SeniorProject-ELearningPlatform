import supabase from "@/utils/supabase/supabaseClient";

export async function getProductMeasureUnits() {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_measure_units")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductMeasureUnitsFromBusiness(cc_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_measure_units")
      .select("*")
      .eq("cc_user_business_id", cc_user_business_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addProductMeasureUnit(name, description, cc_user_business_id) {
  try {
    const { data, error } = await supabase.from("cc_stock_product_measure_units").insert({
      name: name,
      description: description,
      cc_user_business_id: cc_user_business_id
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductMeasureUnit(cc_stock_product_measure_unit_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_measure_units")
      .select("*")
      .eq("id", cc_stock_product_measure_unit_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProductMeasureUnit(cc_stock_product_measure_unit_id, name, description, cc_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_measure_units")
      .update({
        name: name,
        description: description,
        cc_user_business_id: cc_user_business_id
      })
      .eq("id", cc_stock_product_measure_unit_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProductMeasureUnit(cc_stock_product_measure_unit_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_measure_units")
      .delete()
      .eq("id", cc_stock_product_measure_unit_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
