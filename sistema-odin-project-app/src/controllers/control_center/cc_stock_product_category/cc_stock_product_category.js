import supabase from "@/utils/supabase/supabaseClient";

export async function getProductCategories() {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_categories")
      .select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductCategoriesFromBusiness(cc_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_categories")
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

export async function addProductCategory(name, description, cc_user_business_id) {
  try {
    const { data, error } = await supabase.from("cc_stock_product_categories").insert({
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

export async function getProductCategory(cc_stock_product_category_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_categories")
      .select("*")
      .eq("id", cc_stock_product_category_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function editProductCategory(cc_stock_product_category_id, name, description, cc_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_categories")
      .update({
        name: name,
        description: description,
        cc_user_business_id: cc_user_business_id
      })
      .eq("id", cc_stock_product_category_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProductCategory(cc_stock_product_category_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_product_categories")
      .delete()
      .eq("id", cc_stock_product_category_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
