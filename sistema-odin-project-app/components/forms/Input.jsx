
'use client'
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 

const Input = ({ 
  label, 
  type = 'text', 
  name, 
  value, 
  placeholder, 
  onChange, 
  isSubmitted, 
  errorMessage, 
  required,
  textWhite = false
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(prevState => !prevState);
  };

  return (
    <div className="flex flex-col relative">
      <label htmlFor={name} className={`flex gap-1 mt-2 mb-2 ${textWhite ? "text-white" : "text-primary"} font-semibold`}>
        <span>{label}</span>
        {required && <span className="text-title-active-static">*</span>}
      </label>

      <input
        type={type === 'password' && !showPassword ? 'password' : showPassword ? 'text' : type} 
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={`w-full rounded-[5px] p-1 h-[35px] text-black focus-visible:outline-none border-2 ${
          isSubmitted && errorMessage
            ? "border-red-500"
            : "border-transparent focus:border-primary"
        }`}
        style={{ marginBottom: '2px' }}
      />

      {type === 'password' && (
        <span 
          onClick={togglePasswordVisibility} 
          className="absolute right-2 top-[50px] cursor-pointer text-gray-600"
        >
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      )}

      {isSubmitted && errorMessage && (
        <span className="text-red-500 mt-1 font-semibold">{errorMessage}</span>
      )}
    </div>
  );
};

export default Input;
