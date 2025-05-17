import React from 'react';
import Input from "@/components/forms/Input";
import CheckboxInput from "@/components/forms/CheckboxInput";

const CheckboxWithInput = ({ 
  checkboxId, 
  checkboxName, 
  checkboxLabel, 
  checkboxChecked, 
  checkboxOnChange, 
  inputName, 
  inputValue, 
  inputLabel, 
  inputPlaceholder, 
  inputOnChange, 
  isSubmitted, 
  inputErrorMessage 
}) => {
  return (
    <>
      <CheckboxInput
        id={checkboxId}
        checked={checkboxChecked}
        onChange={checkboxOnChange}
        name={checkboxName}
        label={checkboxLabel}
      />
      {checkboxChecked && (
        <Input
          label={inputLabel}
          name={inputName}
          value={inputValue}
          placeholder={inputPlaceholder}
          onChange={inputOnChange}
          isSubmitted={isSubmitted}
          errorMessage={inputErrorMessage}
          required={true}
        />
      )}
    </>
  );
};

export default CheckboxWithInput;
