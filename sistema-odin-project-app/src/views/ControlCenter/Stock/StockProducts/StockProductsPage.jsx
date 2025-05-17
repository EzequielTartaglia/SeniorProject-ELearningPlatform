"use client";

import { deleteProduct, getProducts, getProductsFromBusiness } from "@/src/controllers/control_center/cc_stock_product/cc_stock_product";
import { getProductCategories } from "@/src/controllers/control_center/cc_stock_product_category/cc_stock_product_category";
import { getProductMeasureUnits } from "@/src/controllers/control_center/cc_stock_product_measure_unit/cc_stock_product_measure_unit";
import { getStockProviders } from "@/src/controllers/control_center/cc_stock_provider/cc_stock_provider";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";

import PageHeader from "@/components/page_formats/PageHeader";
import Table from "@/components/tables/Table";
import SearchInput from "@/components/SearchInput";
import Image from "next/image";
import { FiImage } from "react-icons/fi";

export default function StockProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [providers, setProviders] = useState([]);
  const [measureUnits, setMeasureUnits] = useState([]);

  const { userControlCenter } = useUserControlCenterInfo();
  const { showNotification } = useNotification();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  const router = useRouter();

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const fetchedCategories = await getProductCategories();
        const fetchedMeasureUnits = await getProductMeasureUnits();
        const fetchedProviders = await getStockProviders();
        
        let fetchedProducts;
        if (userControlCenter?.cc_user_role_id === 3 || userControlCenter?.cc_user_role_id === 4) {
          fetchedProducts = await getProducts();
        } else {
          fetchedProducts = await getProductsFromBusiness(userControlCenter?.platform_user_business_id);
        }
  
        setCategories(fetchedCategories);
        setMeasureUnits(fetchedMeasureUnits);
        setProviders(fetchedProviders)
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }
  
    if (userControlCenter) {
      fetchProducts();
    }
  }, [userControlCenter, userControlCenter?.cc_user_role_id, userControlCenter?.platform_user_business_id]);
  

  const handleDeleteProduct = async (id) => {
    try {
      await deleteProduct(id);
      setProducts((prevNames) =>
        prevNames.filter((product) => product.id !== id)
      );
      showNotification("¡Producto eliminado exitosamente!", "info");
    } catch (error) {
      console.error("Error trying to delete product:", error.message);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const columns = [
    "image_path",
    "name",
    "cc_stock_product_category_id",
    "price",
    "quantity",
    "cc_stock_product_measure_unit_id",
    "cc_stock_provider_id",
  ];
  const columnAliases = {
    image_path: "Imagen",
    name: "Nombre",
    cc_stock_product_category_id: "Categoría",
    price: "Precio",
    quantity: "Cantidad",
    cc_stock_product_measure_unit_id: "Unidad de medida",
    cc_stock_provider_id: "Proveedor",
  };

  const filteredData = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map((product) => {
      const productCategory = categories.find(
        (category) => category.id === product.cc_stock_product_category_id
      );
      const productMeasureUnit = measureUnits.find(
        (measure_unit) => measure_unit.id === product.cc_stock_product_measure_unit_id
      );
      const productProvider = providers.find(
        (provider) => provider.id === product.cc_stock_provider_id
      );

      
      return {
        id: product.id,
        image_path: (
          <div className="flex justify-center">
            {product.image_path &&
            (product.image_path.startsWith("/") ||
              product.image_path.startsWith("http")) ? (
              <button onClick={() => openImageModal(product.image_path)}>
                <Image
                  src={product.image_path}
                  alt={product.name}
                  width={50}
                  height={50}
                  className="rounded-md object-cover border"
                />
              </button>
            ) : (
              <FiImage
                title="Imagen incompatible"
                className="text-red-400 text-2xl"
              />
            )}
          </div>
        ),
        name: product.name,
        cc_stock_product_category_id: productCategory ? productCategory.name : "N/A",
        price: parseFloat(product.price).toFixed(2),
        cc_stock_product_measure_unit_id: productMeasureUnit
          ? productMeasureUnit.name
          : "N/A",
        quantity: product.quantity,
        cc_stock_provider_id: productProvider
        ? productProvider.name
        : "N/A",
      };
    });

  const hasShow = (item) => {
    return;
  };

  const hasEdit = (item) => {
    return true;
  };

  const hasApprove = (item) => {
    return;
  };

  const userHasAccess =
  userControlCenter?.cc_user_role_id === 3 ||
  userControlCenter?.cc_user_role_id === 4 ||
  userControlCenter?.cc_user_role_id === 5 ||
  userControlCenter?.cc_user_role_id === 6 ||
  userControlCenter?.cc_user_role_id === 7;

  return (
    <>
      <PageHeader
        title={"Productos"}
        goBackRoute={"/platform"}
        goBackText={"Volver al inicio"}
      />

      <SearchInput
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <Table
        title={"Inventario"}
        buttonAddRoute={userHasAccess ? `/control_center/stock/stock_products/new` : null}
        columns={columns}
        data={filteredData}
        columnAliases={columnAliases}
        hasShow={hasShow}
        hasEdit={hasEdit}
        buttonEditRoute={(id) => `/control_center/stock/stock_products/${id}/edit`}
        hasDelete={true}
        buttonDeleteRoute={handleDeleteProduct}
        hasApprove={hasApprove}
        confirmModalText={"¿Estás seguro de que deseas eliminar este producto?"}
      />

      {/* Image preview modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-lg relative max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-1 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>
            <Image
              src={selectedImage}
              alt="Imagen ampliada"
              width={500}
              height={500}
              className="rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  );
}
