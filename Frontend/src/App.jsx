import { useCallback, useEffect, useMemo, useState } from 'react';
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from './api/axios';
import EmployeeForm from './Components/EmployeeForm';
import EmployeeTable from './Components/EmployeeTable';

const PAGE_SIZE = 5;
const pagerBtn =
  'rounded-md border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50';

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    try {
      setEmployees(await getEmployees());
      setError('');
    } catch {
      setError('Could not reach the server. Check that the API is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(
    () => employees.filter((e) => e.name.toLowerCase().includes(search.toLowerCase())),
    [employees, search]
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditing(null);
  }, []);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (emp) => {
    setEditing(emp);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    try {
      if (editing) await updateEmployee(editing.id, data);
      else await createEmployee(data);
      closeForm();
      await load();
    } catch (err) {
      setError('Could not save the employee. Check the details and try again.');
      throw err;
    }
  };

  const handleDelete = async (emp) => {
    if (!window.confirm(`Delete ${emp.name}?`)) return;
    try {
      await deleteEmployee(emp.id);
      if (editing?.id === emp.id) closeForm();
      await load();
    } catch {
      setError('Could not delete the employee.');
    }
  };

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-slate-50 px-4 py-8 text-slate-800">
      <header className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Employee Directory</h1>
          <p className="text-sm text-slate-500">{employees.length} people on the team</p>
        </div>
        <button
          onClick={openAdd}
          className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-medium text-white hover:bg-teal-800"
        >
          Add employee
        </button>
      </header>

      {error && (
        <div role="alert" className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <EmployeeForm open={formOpen} editing={editing} onSubmit={handleSubmit} onClose={closeForm} />

      <div>
        <section className="rounded-xl border border-slate-200 bg-white p-5">
          <input
            type="search"
            placeholder="Search by name"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="mb-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
          />
          {loading ? (
            <p className="py-8 text-center text-sm text-slate-500">Loading…</p>
          ) : (
            <EmployeeTable employees={visible} onEdit={openEdit} onDelete={handleDelete} />
          )}
          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <button className={pagerBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>
              Previous
            </button>
            <span>Page {page} of {totalPages}</span>
            <button className={pagerBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}