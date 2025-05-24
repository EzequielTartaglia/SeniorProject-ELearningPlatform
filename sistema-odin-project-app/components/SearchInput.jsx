import { FaSearch, FaTimes } from 'react-icons/fa';

export default function SearchInput({ placeholder, value, onChange }) {
  return (
    <div className="p-4 relative w-full lg:w-1/2"> 
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-3 pl-10 pr-10 border rounded text-primary text-primary font-semibold"
      />
      <FaSearch className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-500" />
      {value && (
        <FaTimes
          className="absolute right-8 top-1/2 transform -translate-y-1/2 text-red-500 cursor-pointer"
          onClick={() => onChange({ target: { value: '' } })}
        />
      )}
    </div>
  );
}
