import React from 'react';

export default function CallToActionButton({ route, text, openInNewTab, customClasses = "", customFunction }) {
  const linkProps = {
    href: route,
    rel: "noopener",
    className: "flex items-center transition md:justify-center md:hover:scale-105",
    onClick: customFunction ? (e) => customFunction() : null
  };

  if (openInNewTab) {
    linkProps.target = "_blank";
  }

  return (
    <a {...linkProps}>
      <div className="flex items-center">
        <span className="relative inline-flex overflow-hidden rounded-md p-[2px]">
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#af955e_0%,#ffffff_50%,#af955e_100%)]"></span> 
        <div className={`inline-flex items-center justify-center px-4 py-2 text-sm text-green-800 bg-secondary rounded-md cursor-pointer bg-gray-800 text-primary/80 backdrop-blur-3xl whitespace-nowrap ${customClasses}`}> 
            {text}
          </div>
        </span>
      </div>
    </a>
  );
}
