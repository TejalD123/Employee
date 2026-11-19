const palette = [
  'bg-teal-100 text-teal-800',
  'bg-indigo-100 text-indigo-800',
  'bg-amber-100 text-amber-800',
  'bg-rose-100 text-rose-800',
  'bg-sky-100 text-sky-800',
  'bg-emerald-100 text-emerald-800',
];

const colorFor = (name) => palette[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % palette.length];

const initials = (name) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const iconBtn =
  'rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-teal-600';

export default function EmployeeTable({ employees, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="divide-y divide-slate-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex animate-pulse items-center gap-4 px-6 py-4">
            <div className="h-10 w-10 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-40 rounded bg-slate-200" />
              <div className="h-3 w-56 rounded bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!employees.length) {
    return (
      <div className="flex flex-col items-center px-6 py-16 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <p className="mt-4 font-medium text-slate-800">No employees found</p>
        <p className="mt-1 text-sm text-slate-500">Try a different name, or add a new employee.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs text-slate-500">
          <tr>
            <th className="px-6 py-3 font-medium">Employee</th>
            <th className="px-6 py-3 font-medium">Role</th>
            <th className="hidden px-6 py-3 font-medium md:table-cell">Added on</th>
            <th className="px-6 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="transition hover:bg-slate-50/70">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${colorFor(emp.name)}`}
                  >
                    {initials(emp.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-900">{emp.name}</p>
                    <p className="truncate text-slate-500">{emp.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className="whitespace-nowrap rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                  {emp.role}
                </span>
              </td>
              <td className="hidden whitespace-nowrap px-6 py-4 text-slate-500 md:table-cell">
                {formatDate(emp.created_at)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-right">
                <button onClick={() => onEdit(emp)} className={iconBtn} aria-label={`Edit ${emp.name}`} title="Edit">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
                  </svg>
                </button>
                <button
                  onClick={() => onDelete(emp)}
                  className={`${iconBtn} hover:bg-red-50 hover:text-red-600`}
                  aria-label={`Delete ${emp.name}`}
                  title="Delete"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}