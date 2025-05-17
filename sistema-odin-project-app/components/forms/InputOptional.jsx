const InputOptional = ({ label, name, value, placeholder, onChange }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="flex flex-col gap-4 mt-2 mb-2 text-primary">
        {label}
      </label>
      <input
        type="text"
        id={name}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full rounded-[5px] p-1 h-[35px] text-black focus-visible:outline-none border-2 border-transparent focus:border-primary"
      />
    </div>
  );
};

export default InputOptional;