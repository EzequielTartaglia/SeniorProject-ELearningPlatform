export default function UserStatusFilter({ statusFilter, onStatusChange }) {
    return (
      <div className="card-theme mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
        <label htmlFor="statusFilter" className="block text-sm font-semibold text-title-active-static mb-2">
          Actividad de usuario:
        </label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-light transition duration-150 ease-in-out"
        >
          <option value="all">Todos los estados</option>
          <option value="online">En linea</option>
          <option value="offline">Desconectado</option>
        </select>
      </div>
    );
  }
  