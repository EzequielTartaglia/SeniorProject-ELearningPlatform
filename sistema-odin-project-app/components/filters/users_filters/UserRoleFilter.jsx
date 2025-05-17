
export default function UserRoleFilter({ roleFilter, roles, onRoleChange }) {
    return (
      <div className="card-theme mt-4 p-4 border border-gray-300 rounded-lg shadow-md bg-white">
        <label htmlFor="roleFilter" className="block text-sm font-semibold text-title-active-static mb-2">
          Rol de usuario:
        </label>
        <select
          id="roleFilter"
          value={roleFilter}
          onChange={(e) => onRoleChange(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-3 text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-light transition duration-150 ease-in-out"
        >
          <option value="all">Todos los roles</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>
      </div>
    );
  }
  