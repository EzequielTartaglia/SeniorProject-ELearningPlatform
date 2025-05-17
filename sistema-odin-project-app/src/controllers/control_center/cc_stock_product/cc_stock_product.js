import supabase from "@/utils/supabase/supabaseClient";

export async function getProducts() {
  try {
    const { data, error } = await supabase.from("cc_stock_products").select("*");
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addProduct(
  name,
  description,
  has_image,
  image_path,
  cc_stock_product_category_id,
  price,
  cc_stock_product_measure_unit_id,
  quantity,
  has_bar_code,
  bar_code,
  cc_user_business_id,
  cc_stock_provider_id
) {
  try {
    const { data, error } = await supabase.from("cc_stock_products").insert({
      name: name,
      description: description,
      has_image: has_image,
      image_path: image_path,
      cc_stock_product_category_id: cc_stock_product_category_id,
      price: price,
      cc_stock_product_measure_unit_id: cc_stock_product_measure_unit_id,
      quantity: quantity,
      has_bar_code: has_bar_code,
      bar_code: bar_code,
      cc_user_business_id: cc_user_business_id,
      cc_stock_provider_id: cc_stock_provider_id,
    });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProduct(cc_stock_product_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_products")
      .select("*")
      .eq("id", cc_stock_product_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function getProductsFromBusiness(cc_user_business_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_products")
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

export async function editProduct(
  cc_stock_product_id,
  name,
  description,
  has_image,
  image_path,
  cc_stock_product_category_id,
  price,
  cc_stock_product_measure_unit_id,
  quantity,
  has_bar_code,
  bar_code,
  cc_user_business_id,
  cc_stock_provider_id
) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_products")
      .update({
        name: name,
        description: description,
        has_image: has_image,
        image_path: image_path,
        cc_stock_product_category_id: cc_stock_product_category_id,
        price: price,
        cc_stock_product_measure_unit_id: cc_stock_product_measure_unit_id,
        quantity: quantity,
        has_bar_code: has_bar_code,
        bar_code: bar_code,
        cc_user_business_id: cc_user_business_id,
        cc_stock_provider_id: cc_stock_provider_id
      })
      .eq("id", cc_stock_product_id);
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(cc_stock_product_id) {
  try {
    const { data, error } = await supabase
      .from("cc_stock_products")
      .delete()
      .eq("id", cc_stock_product_id)
      .single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    throw error;
  }
}
