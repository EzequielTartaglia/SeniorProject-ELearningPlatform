"use client";

import { getProductMeasureUnit } from "@/src/controllers/control_center/cc_stock_product_measure_unit/cc_stock_product_measure_unit";

import { useEffect, useState } from "react";

import PageHeader from "@/components/page_formats/PageHeader";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StockProductMeasureUnitDetailsPage({ stockProductMeasureUnitId }) {
  const [productMeasureUnit, setProductMeasureUnit] = useState(null);

  useEffect(() => {
    async function fetchProductCategoryDetails() {
      try {
        const measureUnitDetails = await getProductMeasureUnit(stockProductMeasureUnitId);
        setProductMeasureUnit(measureUnitDetails);
      } catch (error) {
        console.error("Error fetching product measure unit:", error.message);
      }
    }

    fetchProductCategoryDetails();
  }, [stockProductMeasureUnitId]);

  return (
    <>
      {productMeasureUnit ? (
        <>
          <PageHeader
            title={productMeasureUnit?.name}
            goBackRoute="/control_center/stock/stock_product_measure_units"
            goBackText="Volver a la lista de unidades de medida"
          />

          <div className="box-theme p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-primary mb-4">
              Detalles de la unidad de medida:
            </h3>

            <div className="mb-4">
              <span className="font-semibold text-primary block">
                Descripción:
              </span>
              <p className="text-primary">
                {productMeasureUnit?.description || "No disponible"}
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
