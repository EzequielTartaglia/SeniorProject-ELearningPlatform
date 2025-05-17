import { FiList, FiSave, FiSettings, FiUser } from "react-icons/fi";

// Compartido para todos los roles
const sharedPermissions = [];

const userPermissionsControlCenter = {
  // Auditor
  1: [
    ...sharedPermissions,
    {
      group: "administration",
      name: "Auditorias",
      route: "/control_center/admin/audits",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "administration",
      name: "Clientes",
      route: "/control_center/admin/clients",
      icon: FiUser,
      requiredPlugins: [1],
    },
  ],
  // Administrador (empresa)
  2: [
    ...sharedPermissions,
    {
      group: "administration",
      name: "Auditorias",
      route: "/control_center/admin/audits",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "administration",
      name: "Legajos para auditorias",
      route: "/control_center/admin/audit_document_templates",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "administration",
      name: "Clientes",
      route: "/control_center/admin/clients",
      icon: FiUser,
      requiredPlugins: [1],
    },
  ],
  // Administrador (empresas)
  3: [
    ...sharedPermissions,
    {
      group: "administration",
      name: "Auditorias",
      route: "/control_center/admin/audits",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "administration",
      name: "Legajos para auditorias",
      route: "/control_center/admin/audit_document_templates",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "administration",
      name: "Clientes",
      route: "/control_center/admin/clients",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "stock",
      name: "Productos",
      route: "/control_center/stock/stock_products",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Proveedores",
      route: "/control_center/stock/stock_providers",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Clientes",
      route: "/control_center/stock/stock_clients",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Categorias",
      route: "/control_center/stock/stock_product_categories",
      icon: FiList,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Medidas (U.)",
      route: "/control_center/stock/stock_product_measure_units",
      icon: FiList,
      requiredPlugins: [2],
    },
    {
      group: "users",
      name: "Usuarios",
      route: "/control_center/users",
      icon: FiUser,
      // `requiredPlugins` not neccesary
    },
    {
      group: "users",
      name: "Empresas en sistema",
      route: "/control_center/control_center_user_businesses",
      icon: FiUser,
      // `requiredPlugins` not neccesary
    },
    {
      group: "settings",
      name: "Ajustes",
      route: "/control_center/control_center_settings",
      icon: FiSettings,
      // `requiredPlugins` not neccesary
    },
  ],
  // Root
  4: [],
  // Operador de Stock
  5: [
    ...sharedPermissions,
    {
      group: "stock",
      name: "Productos",
      route: "/control_center/stock/stock_products",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Proveedores",
      route: "/control_center/stock/stock_providers",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Clientes",
      route: "/control_center/stock/stock_clients",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Categorias",
      route: "/control_center/stock/stock_product_categories",
      icon: FiList,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Medidas (U.)",
      route: "/control_center/stock/stock_product_measure_units",
      icon: FiList,
      requiredPlugins: [2],
    },
  ],
  // Administrador de Stock
  6: [
    ...sharedPermissions,
    {
      group: "stock",
      name: "Productos",
      route: "/control_center/stock/stock_products",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Proveedores",
      route: "/control_center/stock/stock_providers",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Clientes",
      route: "/control_center/stock/stock_clients",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Categorias",
      route: "/control_center/stock/stock_product_categories",
      icon: FiList,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Medidas (U.)",
      route: "/control_center/stock/stock_product_measure_units",
      icon: FiList,
      requiredPlugins: [2],
    },
  ],
  // Gerente general (empresa)
  7: [
    ...sharedPermissions,
    {
      group: "administration",
      name: "Auditorias",
      route: "/control_center/admin/audits",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "administration",
      name: "Legajos para auditorias",
      route: "/control_center/admin/audit_document_templates",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "administration",
      name: "Clientes",
      route: "/control_center/admin/clients",
      icon: FiUser,
      requiredPlugins: [1],
    },
    {
      group: "stock",
      name: "Productos",
      route: "/control_center/stock/stock_products",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Proveedores",
      route: "/control_center/stock/stock_providers",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Clientes",
      route: "/control_center/stock/stock_clients",
      icon: FiSave,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Categorias",
      route: "/control_center/stock/stock_product_categories",
      icon: FiList,
      requiredPlugins: [2],
    },
    {
      group: "stock",
      name: "Medidas (U.)",
      route: "/control_center/stock/stock_product_measure_units",
      icon: FiList,
      requiredPlugins: [2],
    },
    {
      group: "users",
      name: "Usuarios",
      route: "/control_center/users",
      icon: FiUser,
      // `requiredPlugins` not neccesary
    },
  ],
};

export default userPermissionsControlCenter;
