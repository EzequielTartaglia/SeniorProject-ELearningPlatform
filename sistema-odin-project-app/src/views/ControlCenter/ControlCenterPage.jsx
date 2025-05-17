"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/page_formats/PageHeader";
import { useUserControlCenterContext } from "@/contexts/UserInfoControlCenterContext";

import {
  FaBox,
  FaClipboardList,
  FaDollyFlatbed,
  FaFileAlt,
  FaHandshake,
  FaRuler,
  FaSearch,
  FaTags,
  FaUsers,
  FaUserTie,
} from "react-icons/fa";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getControlCenterUserBusinessEnabledPluggins } from "@/src/controllers/control_center/control_center_user_business/control_center_user_business";

export default function ControlCenterPage() {
  const { userControlCenter } = useUserControlCenterContext();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [enabledPlugins, setEnabledPlugins] = useState([]);

  useEffect(() => {
    if (userControlCenter !== undefined) {
      setLoading(false);
    }
  }, [userControlCenter]);

  useEffect(() => {
    const fetchEnabledPlugins = async () => {
      if (!userControlCenter) {
        setLoading(false);
        return;
      }

      try {
        const plugins = await getControlCenterUserBusinessEnabledPluggins(userControlCenter.cc_user_business_id);

        const parsedEnabledPlugins =
          typeof plugins === "string" ? JSON.parse(plugins) : plugins;

        const selectedPluginIds = Array.isArray(parsedEnabledPlugins)
          ? parsedEnabledPlugins.map((plugin) => plugin.id || plugin)
          : [];

        setEnabledPlugins(selectedPluginIds);
      } catch (error) {
        console.error("Error al obtener plugins:", error);
        setEnabledPlugins([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnabledPlugins();
  }, [userControlCenter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  const cardsAuditPlugin = [
    {
      title: "Auditorías",
      description: "Accede a tus auditorías y gestiona su progreso.",
      route: "/control_center/admin/audits",
      icon: <FaClipboardList className="text-blue-500" />,
      visibleForRoles: [1, 2, 3, 4, 7],
    },
    {
      title: "Plantillas de Auditorías",
      description: "Crea, edita y organiza tus plantillas de auditorías.",
      route: "/control_center/admin/audit_document_templates",
      icon: <FaFileAlt className="text-green-500" />,
      visibleForRoles: [1, 2, 3, 4, 7],
    },
    {
      title: "Clientes",
      description: "Administra la información de tus clientes fácilmente.",
      route: "/control_center/admin/clients",
      icon: <FaUsers className="text-purple-500" />,
      visibleForRoles: [1, 2, 3, 4, 7],
    },
  ];

  const cardsStockPlugin = [
    {
      title: "Inventario",
      description: "Accede a tus productos y gestionalos.",
      route: "/control_center/stock/stock_products",
      icon: <FaDollyFlatbed className="text-yellow-500" />,
      visibleForRoles: [3, 4, 5, 6, 7],
    },
    {
      title: "Proveedores",
      description: "Administra la información de tus proveedores fácilmente.",
      route: "/control_center/stock/stock_providers",
      icon: <FaHandshake className="text-green-500" />,
      visibleForRoles: [3, 4, 5, 6, 7],
    },
    {
      title: "Clientes",
      description: "Administra la información de tus clientes fácilmente.",
      route: "/control_center/stock/stock_clients",
      icon: <FaUserTie className="text-blue-500" />,
      visibleForRoles: [3, 4, 5, 6, 7],
    },
    {
      title: "Categorías",
      description: "Administra la información de tus categorías de productos.",
      route: "/control_center/stock/stock_product_categories",
      icon: <FaTags className="text-orange-500" />,
      visibleForRoles: [3, 4, 5, 6, 7],
    },
    {
      title: "Medidas (U.)",
      description: "Administra la información de tus unidades de medida de productos.",
      route: "/control_center/stock/stock_product_measure_units",
      icon: <FaRuler className="text-indigo-500" />,
      visibleForRoles: [3, 4, 5, 6, 7],
    },
  ];
  

  return (
    <>
      <PageHeader title="Centro de Control" />

      {userControlCenter && (
        <>
          {/* Auditoría - Solo si el usuario tiene el plugin habilitado (ID 1) */}
          {enabledPlugins.includes(1) && (
            <section className="max-w-6xl mx-auto px-4 mt-12">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FaSearch size={24} /> Auditorías
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardsAuditPlugin.map((card) => {
                  if (!card.visibleForRoles.includes(userControlCenter?.cc_user_role_id)) {
                    return null;
                  }
                  return (
                    <div
                      key={card.title}
                      className="card-theme rounded-md cursor-pointer transition-transform transform hover:-translate-y-1"
                      onClick={() => router.push(card.route)}
                    >
                      <div className="flex justify-center items-center text-4xl mb-4">
                        {card.icon}
                      </div>
                      <h2 className="text-lg font-bold text-primary text-center mb-2">
                        {card.title}
                      </h2>
                      <p className="text-white text-sm text-center">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Stock - Solo si el usuario tiene el plugin habilitado (ID 2) */}
          {enabledPlugins.includes(2) && (
            <section className="max-w-6xl mx-auto px-4 mt-12">
              <h2 className="text-2xl font-bold text-primary mb-6 flex items-center gap-2">
                <FaBox size={24} />
                Gestión de stock
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cardsStockPlugin.map((card) => {
                  if (!card.visibleForRoles.includes(userControlCenter?.cc_user_role_id)) {
                    return null;
                  }
                  return (
                    <div
                      key={card.title}
                      className="card-theme rounded-md cursor-pointer transition-transform transform hover:-translate-y-1"
                      onClick={() => router.push(card.route)}
                    >
                      <div className="flex justify-center items-center text-4xl mb-4">
                        {card.icon}
                      </div>
                      <h2 className="text-lg font-bold text-primary text-center mb-2">
                        {card.title}
                      </h2>
                      <p className="text-white text-sm text-center">
                        {card.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
