"use client";

import { getProductCategories } from "@/src/controllers/control_center/cc_stock_product_category/cc_stock_product_category";
import { addProduct } from "@/src/controllers/control_center/cc_stock_product/cc_stock_product";
import { getProductMeasureUnits } from "@/src/controllers/control_center/cc_stock_product_measure_unit/cc_stock_product_measure_unit";
import {
  getStockProviders,
  getStockProvidersFromBusiness,
} from "@/src/controllers/control_center/cc_stock_provider/cc_stock_provider";

import { useNotification } from "@/contexts/NotificationContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import Input from "@/components/forms/Input";
import PageHeader from "@/components/page_formats/PageHeader";
import SelectInput from "@/components/forms/SelectInput";
import CheckboxWithInput from "@/components/forms/CheckboxWithInput";
import TextArea from "@/components/forms/TextArea";
import CheckboxInput from "@/components/forms/CheckboxInput";
import FileInput from "@/components/forms/FileInput";
import SubmitLoadingButton from "@/components/forms/SubmitLoadingButton";

export default function AddStockProductForm() {
  const { userControlCenter } = useUserControlCenterContext();

  const [product, setProduct] = useState({
    name: "",
    description: "",
    has_image: false,
    image_path: "",
    cc_stock_product_category_id: "",
    price: "",
    cc_stock_product_measure_unit_id: "",
    quantity: "",
    has_bar_code: false,
    bar_code: "",
    cc_user_business_id: null,
    cc_stock_provider_id: null,
  });
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchData() {
      try {
        const fetchedCategories = await getProductCategories();
        const fetchedMeasureUnits = await getProductMeasureUnits();

        if (
          userControlCenter.cc_user_role_id === 3 ||
          userControlCenter.cc_user_role_id === 4
        ) {
          const fetchedProviders = await getStockProviders();
          setProviders(fetchedProviders);
        } else {
          const fetchedProviders = await getStockProvidersFromBusiness(
            userControlCenter.cc_user_business_id
          );
          setProviders(fetchedProviders);
        }

        setCategories(fetchedCategories);
        setMeasureUnits(fetchedMeasureUnits);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
    fetchData();
  }, [
    userControlCenter.cc_user_business_id,
    userControlCenter.cc_user_role_id,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (
      !product.name ||
      !product.cc_stock_product_category_id ||
      !product.cc_stock_provider_id ||
      (product.has_image && !product.image_path) ||
      !product.price ||
      !product.cc_stock_product_measure_unit_id ||
      !product.quantity ||
      (product.has_bar_code && !product.bar_code)
    ) {
      return;
    }

    setIsLoading(true);

    try {
      await addProduct(
        product.name,
        product.description,
        product.has_image,
        product.has_image ? product.image_path : null,
        product.cc_stock_product_category_id,
        product.price,
        product.cc_stock_product_measure_unit_id,
        product.quantity,
        product.has_bar_code,
        product.has_bar_code ? product.bar_code : null,
        userControlCenter.cc_user_business_id,
        product.cc_stock_provider_id
      );

      showNotification("¡Producto agregado exitosamente!", "success");

      setTimeout(() => {
        setIsLoading(false);
        router.push(`/control_center/stock/stock_products`);
      }, 2000);
    } catch (error) {
      console.error("Error adding product:", error.message);
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setProduct({
      ...product,
      [name]: newValue,
    });
  };

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
  };

  const handleFileUploadSuccess = (url) => {
    setProduct((prevProduct) => ({
      ...prevProduct,
      has_image: true,
      image_path: url,
    }));
  };

  return (
    <>
      <PageHeader
        title="Nuevo Producto"
        goBackRoute="/control_center/stock/stock_products"
        goBackText="Volver al listado de productos"
      />

      <form onSubmit={handleSubmit} className="box-theme">
        <Input
          label="Nombre"
          name="name"
          value={product.name}
          required={true}
          placeholder=""
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
        />

        <CheckboxWithInput
          checkboxId="has_bar_code"
          checkboxChecked={product.has_bar_code}
          checkboxOnChange={handleInputChange}
          checkboxName="has_bar_code"
          checkboxLabel="¿Contiene codigo de barra?"
          inputName="bar_code"
          inputValue={product.bar_code}
          inputLabel="Codigo de barra"
          inputPlaceholder="Ingrese el codigo de barra del producto..."
          inputOnChange={handleInputChange}
          isSubmitted={isSubmitted}
          inputErrorMessage="Campo obligatorio"
        />

        <TextArea
          label="Descripción"
          name="description"
          value={product.description}
          placeholder="Escribe una breve descripción del producto..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
        />

        <CheckboxInput
          id="has_image"
          name="has_image"
          label="¿Tiene imagen?"
          checked={product.has_image}
          onChange={handleInputChange}
        />

        {product.has_image && (
          <div className="mt-4">
            <FileInput
              name="checkpointImage"
              onChange={handleFileChange}
              onUploadSuccess={handleFileUploadSuccess}
              showPreview={false}
            />
          </div>
        )}

        <SelectInput
          label="Categoría del Producto"
          name="cc_stock_product_category_id"
          value={product.cc_stock_product_category_id}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={categories}
          columnName="name"
          idColumn="id"
          required={true}
        />

        <SelectInput
          label="Proveedor del Producto"
          name="cc_stock_provider_id"
          value={product.cc_stock_provider_id}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={providers}
          columnName="name"
          idColumn="id"
          required={true}
        />

        <Input
          label="Precio"
          name="price"
          value={product.price}
          required={true}
          placeholder="999.99"
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          type="number"
          step="0.01"
        />

        <SelectInput
          label="Unidad de Medida"
          name="cc_stock_product_measure_unit_id"
          value={product.cc_stock_product_measure_unit_id}
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          table={measureUnits}
          columnName="name"
          idColumn="id"
          required={true}
        />

        <Input
          label="Cantidad"
          name="quantity"
          value={product.quantity}
          required={true}
          placeholder="Escribe la cantidad del producto..."
          onChange={handleInputChange}
          isSubmitted={isSubmitted}
          errorMessage="Campo obligatorio"
          type="number"
        />

        <SubmitLoadingButton isLoading={isLoading} type="submit">
          Agregar Producto
        </SubmitLoadingButton>
      </form>
    </>
  );
}
