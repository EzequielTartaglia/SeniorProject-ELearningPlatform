"use client";

import { getProductCategory } from "@/src/controllers/control_center/cc_stock_product_category/cc_stock_product_category";
import { useEffect, useState } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StockProductCategoryDetailsPage({ stockProductCategoryId }) {
  const [productCategory, setProductCategory] = useState(null);

  useEffect(() => {
    async function fetchProductCategoryDetails() {
      try {
        const categoryDetails = await getProductCategory(stockProductCategoryId);
        setProductCategory(categoryDetails);
      } catch (error) {
        console.error("Error fetching product category:", error.message);
      }
    }

    fetchProductCategoryDetails();
  }, [stockProductCategoryId]);

  return (
    <>
      {productCategory ? (
        <>
          <PageHeader
            title={productCategory?.name}
            goBackRoute="/control_center/stock/stock_product_categories"
            goBackText="Volver a la lista de categorías"
          />

          <div className="box-theme p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Detalles de la Categoría:
            </h3>

            <div className="mb-4">
              <span className="font-semibold text-primary block">
                Descripción:
              </span>
              <p className="text-primary">
                {productCategory?.description || "No disponible"}
              </p>
            </div>
          </div>
        </>
      ) : (
        <LoadingSpinner />
      )}
    </>
  );
}
