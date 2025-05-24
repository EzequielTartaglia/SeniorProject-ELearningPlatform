import React from "react";
import Button from "../Button";
import { FiPlus } from "react-icons/fi";

const SelectInput = ({
  label,
  name,
  value,
  onChange,
  isSubmitted,
  errorMessage,
  table = [],
  columnName,
  columnName2,
  idColumn,
  required = false,
  hasAdd = false,
  onAddRedirect,
}) => {
  return (
    <div className="my-2">
      <label htmlFor={name} className="block text-primary font-medium mb-1">
        {label}{" "}
        {required && <span className="text-title-active-static">*</span>}
      </label>

      <div className="flex items-center gap-2">
        {/* Select */}
        <select
          id={name}
          name={name}
          value={value !== null ? value : ""}
          onChange={onChange}
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            isSubmitted && !value ? "border-red-500" : ""
          }`}
          required={required}
        >
          <option value="">Seleccione {label.toLowerCase()}</option>
          {table.map((item) => (
            <option key={item[idColumn]} value={item[idColumn]}>
              {item[columnName]} {item[columnName2] ? item[columnName2] : ""}
            </option>
          ))}
        </select>

        {hasAdd && (
          <Button
            customFunction={onAddRedirect}
            customClasses={"px-4 py-2 bg-primary text-title-active-static rounded-md shadow-md hover:bg-secondary transition duration-300 bg-primary border-secondary-light text-title-active-static font-semibold bg-dark-mode"}
            icon={<FiPlus size={24}/>}
            title={"Agregar nueva seccion a la auditoria"}
            isAnimated={false}
          />
        )}
      </div>

      {isSubmitted && !value && (
        <p className="text-red-500 text-sm mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default SelectInput;
