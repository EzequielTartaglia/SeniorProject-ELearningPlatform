"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import CoursesList from "./CoursesList";

export default function CoursesListWithTitle({
  title,
  items,
  columnName = "name",
  columnNameIsDate,
  labelColumnName2,
  labelColumnName3,
  columnName2,
  columnName3,
  buttonShowRoute,
  buttonEditRoute,
  buttonDeleteRoute,
  buttonAddRoute,
  confirmModalText,
  hasAdd,
  hasShow,
  hasShowIcon,
  hasEdit,
  hasDelete,
  hasExtraButton,
  extraButtonIcon,
  extraButtonTitle,
  onExtraButtonClick,
  hasExtraButton2,
  extraButtonIcon2,
  extraButtonTitle2,
  onExtraButtonClick2,
  hasExtraButton3,
  extraButtonIcon3,
  extraButtonTitle3,
  buttonEditRoute3,
  customRender,
}) {
  const [isLoading, setIsLoading] = useState(items.length === 0);
  const hasData = items && items.length > 0;

  useEffect(() => {
    let timer;
    if (isLoading) {
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  return (
    <div className="box-theme font-semibold">
      <div className="flex justify-between items-center mb-4">
        {title && title && (
          <h3 className="text-2xl font-semibold text-title-active-static">
            {title}
          </h3>
        )}

        {customRender && customRender}
        
        {hasAdd && buttonAddRoute && (
          <Link href={buttonAddRoute}>
            <button
              className="p-2 rounded-full primary-button-success text-primary shadow-md transition-transform duration-300 hover:-translate-y-1 mr-2"
              title="Agregar"
            >
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
            <CoursesList
              list={items}
              columnName={columnName}
              columnNameIsDate={columnNameIsDate}
              labelColumnName2={labelColumnName2}
              columnName2={columnName2}
              labelColumnName3={labelColumnName3}
              columnName3={columnName3}
              buttonShowRoute={buttonShowRoute}
              buttonEditRoute={buttonEditRoute}
              buttonDeleteRoute={buttonDeleteRoute}
              confirmModalText={confirmModalText}
              hasShow={hasShow}
              hasShowIcon={hasShowIcon}
              hasEdit={hasEdit}
              hasDelete={hasDelete}
              hasExtraButton={hasExtraButton}
              extraButtonIcon={extraButtonIcon}
              extraButtonTitle={extraButtonTitle}
              onExtraButtonClick={onExtraButtonClick}
              hasExtraButton2={hasExtraButton2}
              extraButtonIcon2={extraButtonIcon2}
              extraButtonTitle2={extraButtonTitle2}
              onExtraButtonClick2={onExtraButtonClick2}
              hasExtraButton3={hasExtraButton3}
              extraButtonIcon3={extraButtonIcon3}
              extraButtonTitle3={extraButtonTitle3}
              buttonEditRoute3={buttonEditRoute3}
            />
          ) : (
            <ul className="shadow-md rounded-lg p-1 bg-primary mt-4 relative w-full bg-dark-mode">
              <li className="text-center py-2 text-center text-gray-400">
                <p>No hay nada para mostrar.</p>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}
