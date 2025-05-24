"use client";

import { addProductMeasureUnit } from "@/src/controllers/control_center/cc_stock_product_measure_unit/cc_stock_product_measure_unit";
import { useNotification } from "@/contexts/NotificationContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";
import TextArea from "@/components/forms/TextArea";

export default function AddStockProductMeasureUnitForm() {
  const { userControlCenter } = useUserControlCenterContext();

  const [productMeasureUnit, setProductMeasureUnit] = useState({
    name: "",
    description: "",
    cc_user_business_id: null
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (!productMeasureUnit.name) {
      return;
    }

    setIsLoading(true);

    try {
      await addProductMeasureUnit(
        productMeasureUnit.name,
        productMeasureUnit.description,
        userControlCenter.cc_user_business_id
      );

      showNotification("¡Unidad de medida agregada exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/control_center/stock/stock_product_measure_units`);
      }, 2000);
    } catch (error) {
      console.error("Error adding product measure unit:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductMeasureUnit({ ...productMeasureUnit, [name]: value });
  };

  return (
    <>
      <PageHeader
        title="Nueva unidad de medida"
        goBackRoute="/control_center/stock/stock_product_measure_units"
        goBackText="Volver al listado de unidades de medida"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={productMeasureUnit.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripcion"
          name="description"
          value={productMeasureUnit.description}
          placeholder="Escribe una breve descripción de la unidad de medida..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar unidad de medida
        </SubmitLoadingButton>
      </form>
    </>
  );
}
