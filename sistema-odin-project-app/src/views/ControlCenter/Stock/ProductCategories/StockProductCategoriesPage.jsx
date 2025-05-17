"use client";

import { deleteProductCategory, getProductCategories, getProductCategoriesFromBusiness } from "@/src/controllers/control_center/cc_stock_product_category/cc_stock_product_category";
import { useUserControlCenterInfo } from "@/src/helpers/useUserControlCenterInfo";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/contexts/NotificationContext";

import ListWithTitle from "@/components/lists/ListWithTitle";
import PageHeader from "@/components/page_formats/PageHeader";
import SearchInput from "@/components/SearchInput";

export default function StockProductCategoriesPage() {
  const { userControlCenter } = useUserControlCenterInfo();

  const [productCategoriesNames, setProductCategoriesNames] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const router = useRouter();
  const { showNotification } = useNotification();

  useEffect(() => {
    async function fetchProductCategoriesNames() {
      try {
        let names;
        if (userControlCenter?.cc_user_role_id === 3 || userControlCenter?.cc_user_role_id === 4) {
          names = await getProductCategories();
        } else {
          names = await getProductCategoriesFromBusiness(userControlCenter?.cc_user_business_id);
        }
        setProductCategoriesNames(names);
      } catch (error) {
        console.error(
          "Error fetching product categories:",
          error.message
        );
      }
    }

    if (userControlCenter) {
      fetchProductCategoriesNames();
    }
  }, [userControlCenter, userControlCenter?.cc_user_business_id, userControlCenter?.cc_user_role_id]); 

  const handleDeleteProductCategory = async (id) => {
    try {
      await deleteProductCategory(id);
      setProductCategoriesNames((prevNames) =>
        prevNames.filter((product_category) => product_category.id !== id)
      );
      showNotification("¡Categoria eliminada exitosamente!", "info");
    } catch (error) {
      console.error("Error trying to delete the category:", error.message);
    }
  };

  const userHasAccess =
    userControlCenter?.cc_user_role_id === 3 ||
    userControlCenter?.cc_user_role_id === 4 ||
    userControlCenter?.cc_user_role_id === 5 ||
    userControlCenter?.cc_user_role_id === 6 ||
    userControlCenter?.cc_user_role_id === 7;

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtrar las categorías por el término de búsqueda
  const filteredCategories = productCategoriesNames.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <PageHeader
        title={"Categorias"}
        goBackRoute={`/control_center/stock/stock_products`}
        goBackText={"Volver a la lista de productos"}
      />

      <SearchInput
        placeholder="Buscar categoria..."
        value={searchTerm}
        onChange={handleSearchChange}
      />

      <ListWithTitle
        title=""
        hasAdd={userHasAccess}
        buttonAddRoute={userHasAccess ? `/control_center/stock/stock_product_categories/new` : null}
        items={filteredCategories}
        buttonShowRoute={(id) => `/control_center/stock/stock_product_categories/${id}`}
        hasEdit={userHasAccess}
        buttonEditRoute={(id) =>
          userHasAccess ? `/control_center/stock/stock_product_categories/${id}/edit` : null
        }
        hasDelete={userHasAccess}
        buttonDeleteRoute={handleDeleteProductCategory}
        columnName="name"
        confirmModalText="¿Estás seguro de que deseas eliminar esta categoria?"
        hasShow={(id) => true}
      />
    </>
  );
}
