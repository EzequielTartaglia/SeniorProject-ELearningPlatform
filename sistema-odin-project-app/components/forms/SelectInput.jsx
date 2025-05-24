import React from 'react';

const SelectInput = ({ label, name, value, onChange, isSubmitted, errorMessage, table = [], columnName, idColumn, required = false }) => {
  return (
    <div className="my-2">
      <label htmlFor={name} className="block text-primary font-medium mb-1">
        {label} {required && <span className="text-title-active-static">*</span>}
      </label>
      <select
        id={name}
        name={name}
        value={value !== null ? value : ''}
        onChange={onChange}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${isSubmitted && !value ? "border-red-500" : ""
          }`}
        required={required}
      >
        <option value="">Seleccione {label}</option>
        {table.map((item) => (
          <option key={item[idColumn]} value={item[idColumn]}>{item[columnName]}</option>
        ))}
      </select>
      {isSubmitted && !value && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
    </div>
  );
};

export default SelectInput;
