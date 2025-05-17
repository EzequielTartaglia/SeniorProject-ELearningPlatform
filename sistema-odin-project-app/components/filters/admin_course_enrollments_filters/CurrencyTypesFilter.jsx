export default function CurrencyTypesFilter({
  currencyFilter,
  uniqueCurrencies,
  onCurrencyChange,
}) {
  return (
    <div className="card-theme mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
      <label htmlFor="currencyFilter" className="block text-sm font-semibold text-title-active-static mb-2">
        Tipo de moneda:
      </label>
      <select
        id="currencyFilter"
        value={currencyFilter}
        onChange={(e) => onCurrencyChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-light transition duration-150 ease-in-out"
      >
        <option value="all">Todas las monedas</option>
        {uniqueCurrencies.map((currency) => (
          <option key={currency} value={currency}>
            {currency}
          </option>
        ))}
      </select>
    </div>
  );
}
