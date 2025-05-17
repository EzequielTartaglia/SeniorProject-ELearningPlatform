"use client";

import { useState } from "react";

const MultiSelectInput = ({
  label,
  name,
  value = [],
  onChange,
  isSubmitted,
  errorMessage,
  table = [],
  columnName,
  columnName2,
  idColumn,
  required = false,
}) => {
  const [selectedValues, setSelectedValues] = useState(value);

  const handleOptionClick = (id) => {
    let newSelectedValues = [...selectedValues];

    if (newSelectedValues.includes(id)) {
      newSelectedValues = newSelectedValues.filter((item) => item !== id);
    } else {
      newSelectedValues.push(id);
    }

    setSelectedValues(newSelectedValues);
    onChange({ target: { name, value: newSelectedValues } });
  };

  return (
    <div className="my-2">
      <label htmlFor={name} className="block text-primary font-medium mb-1">
        {label}{" "}
        {required && <span className="text-title-active-static">*</span>}
      </label>
      <div className="border rounded w-full py-2 px-3 bg-white">
        {table.map((item) => (
          <div
            key={item[idColumn]}
            onClick={() => handleOptionClick(item[idColumn])}
            className={`my-1 cursor-pointer py-2 px-2 rounded ${
              selectedValues.includes(item[idColumn])
                ? "border-dark-mode bg-dark-mode text-white"
                : "bg-gray-100 text-black border border-white"
            }`}
          >
            {item[columnName]} {item[columnName2] ? item[columnName2] : ""}
          </div>
        ))}
      </div>
      {isSubmitted && selectedValues.length === 0 && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default MultiSelectInput;
