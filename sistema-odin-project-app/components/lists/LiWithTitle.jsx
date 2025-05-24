"use client";
import Link from "next/link";
import { FiBook, FiEdit } from "react-icons/fi";
import Button from "@/components/Button";
import { useEffect, useState } from "react";

export default function LiWithTitle({
  title,
  buttonTitle,
  items,
  buttonRouteTitle,
  buttonRoute,
  extraButtonRoute,
  extraButtonRouteTitle,
  hasIconRight = true,
  iconRight = <FiEdit size={24}/>,
  extraIconRight = <FiEdit size={24}/>,
  iconRightTitle,
  titleBackgroundColor = "bg-secondary",
  textColor = "text-primary",
  hasLiButton = true,
  hasExtraLiButton = false,
  iconBackgroundColor = "text-edit-link",
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
    <div
      className={`box-theme font-semibold`}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg text-primary">{title}</h3>
        {hasIconRight && buttonRoute && iconRightTitle && (
          <Link href={buttonRouteTitle}>
            <button
              className={`p-2 rounded-full text-blue-500 border-dark-mode bg-dark-mode shadow-md duration-300 hover:-translate-y-1 ${titleBackgroundColor}`}
              title="Administrar"
            >
              {iconRightTitle}
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
            <ul className="list-disc list-inside">
              {items.map((item, index) => (
                <li
                  key={index}
                  className={`li-theme flex items-center justify-between rounded-md pr-3 py-1 shadow-md transition duration-300 hover:-translate-y-1 hover:${iconBackgroundColor} w-full border-primary mt-4`}
                >
                  <div className={`flex-grow text-center ${textColor}`}>
                    {item}
                  </div>

                  {hasExtraLiButton && (
                    <Button
                      customClasses={`flex items-center shadow-none ${iconBackgroundColor}`}
                      route={extraButtonRoute}
                      icon={extraIconRight}
                      isAnimated={false}
                      title={extraButtonRouteTitle}
                    />
                  )}

                  {hasLiButton && (
                    <Button
                      customClasses={`flex items-center shadow-none ${iconBackgroundColor}`}
                      route={buttonRoute}
                      icon={iconRight}
                      isAnimated={false}
                      title={buttonTitle}
                    />
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <ul
              className={`shadow-md rounded-lg p-1 mt-4 relative w-full ${iconBackgroundColor}`}
            >
              <li
                className={`text-center py-2 text-center text-gray-400 ${textColor} `}
              >
                <p >No hay nada para mostrar.</p>
              </li>
            </ul>
          )}
        </>
      )}
    </div>
  );
}
