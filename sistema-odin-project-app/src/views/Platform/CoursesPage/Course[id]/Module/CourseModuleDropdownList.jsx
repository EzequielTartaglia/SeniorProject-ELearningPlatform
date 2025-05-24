'use client'

import ModuleDropdown from "../CourseModuleDropdown";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState } from "react";

export default function ModuleDropdownList({
  modulesWithClasses,
  buttonShowRoute,
  buttonEditRoute,
  buttonDeleteRoute,
  buttonAddRouteModuleClass,
  buttonEditRouteModule,
  buttonDeleteModuleRoute,
  columnName,
  buttonAddModule,
  hasAddModule = true,
  hasAddClass,
  hasEditModule,
  hasDeleteModule,
  hasShowClass,
  hasEditClass,
  hasDeleteClass,
  title = "Módulos",
}) {
  const sortedModulesWithClasses = [...modulesWithClasses].sort((a, b) => a.module.id - b.module.id);
  const [isLoading, setIsLoading] = useState(sortedModulesWithClasses.length === 0);
  const hasData = sortedModulesWithClasses && sortedModulesWithClasses.length > 0;

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 2500); 
    } else {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="box-theme">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-primary">{title}</h3>
        {hasAddModule && ( 
          <Link href={buttonAddModule} className="flex items-center justify-center" alt="Agregar Módulo" title="Agregar Módulo">
          <button className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1">
            <FiPlus size={24} />
          </button>
        </Link>
        )}
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 spinner-border border-opacity-50"></div>
        </div>
      ) : (
        <>
          {hasData ? (
            <div className="gap-5 list-none p-0 w-full text-primary">
              {sortedModulesWithClasses.map(({ module, moduleClasses }) => (
                
                <ModuleDropdown
                  key={module.id}
                  moduleId={module.id}
                  moduleDescription={module.description}
                  module={module}
                  moduleClasses={moduleClasses}
                  hasAddClass={hasAddClass}
                  buttonAddRouteModuleClass={buttonAddRouteModuleClass}
                  hasEditModule={hasEditModule}
                  buttonEditRouteModule={buttonEditRouteModule}
                  hasDeleteModule={hasDeleteModule}
                  buttonDeleteRouteModule={buttonDeleteModuleRoute}

                  hasShowClass={hasShowClass}
                  buttonShowRoute={buttonShowRoute}
                  hasEditClass={hasEditClass}
                  buttonEditRoute={buttonEditRoute}
                  hasDeleteClass={hasDeleteClass}
                  buttonDeleteRoute={buttonDeleteRoute}
                  columnName={columnName}
                />
              ))}
            </div>
          ) : (
            <ul className="shadow-md rounded-lg p-1 bg-primary mt-4 relative w-full bg-secondary">
              <li className="text-center py-2 text-center text-gray-400">
                <p >No hay nada para mostrar.</p>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}
