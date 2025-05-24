const CheckboxInput = ({ id, name, label, checked, onChange }) => {
  return (
    <div className="mt-4 flex items-center">
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="mr-2"
      />
      <label htmlFor={id} className="text-primary">
        {label}
      </label>
    </div>
  );
};

export default CheckboxInput;
