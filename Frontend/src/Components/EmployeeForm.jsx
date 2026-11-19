import { useEffect, useRef, useState } from 'react';
import "../style.css"

const empty = { name: '', email: '', role: '' };
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const roleSuggestions = [
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'UI/UX Designer',
  'QA Engineer',
  'Project Manager',
];

const rules = {
  name: (v) => (v.trim().length < 2 ? 'Enter the full name (at least 2 characters)' : ''),
  email: (v) => (emailRe.test(v.trim()) ? '' : 'Enter a valid email, e.g. name@company.com'),
  role: (v) => (v.trim() ? '' : 'Enter or pick a job role'),
};

const initials = (name) =>
  name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

const icons = {
  name: <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />,
  email: <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 2-10 7L2 6" />,
  role: <path d="M3 7h18v13H3zM8 7V4h8v3M3 13h18" />,
};

const Icon = ({ name, className = '' }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {icons[name]}
  </svg>
);

export default function EmployeeForm({ open, editing, onSubmit, onClose }) {
  const [form, setForm] = useState(empty);
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const firstField = useRef(null);

  useEffect(() => {
    if (!open) return;
    setForm(editing ? { name: editing.name, email: editing.email, role: editing.role } : empty);
    setTouched({});
    firstField.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [open, editing, onClose]);

  if (!open) return null;

  const errors = Object.fromEntries(Object.keys(rules).map((k) => [k, rules[k](form[k])]));
  const valid = Object.values(errors).every((e) => !e);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, role: true });
    if (!valid) return;
    setSaving(true);
    try {
      await onSubmit(form);
    } catch {
      // error is shown by the parent; keep the form values
    } finally {
      setSaving(false);
    }
  };

  const field = (key, label, placeholder, type = 'text') => {
    const showError = touched[key] && errors[key];
    return (
      <div>
        <label htmlFor={key} className="mb-2 block text-sm font-medium text-slate-700">
          {label}
        </label>
        <div className="relative">
          <Icon
            name={key}
            className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 ${
              showError ? 'text-red-400' : 'text-slate-400'
            }`}
          />
          <input
            id={key}
            ref={key === 'name' ? firstField : null}
            type={type}
            placeholder={placeholder}
            value={form[key]}
            onChange={(e) => setForm({ ...form, [key]: e.target.value })}
            onBlur={() => setTouched({ ...touched, [key]: true })}
            aria-invalid={!!showError}
            aria-describedby={showError ? `${key}-error` : undefined}
            className={`w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-base outline-none transition focus:ring-4 ${
              showError
                ? 'border-red-400 focus:ring-red-500/15'
                : 'border-slate-200 focus:border-teal-600 focus:ring-teal-600/15'
            }`}
          />
        </div>
        {showError && (
          <p id={`${key}-error`} className="mt-2 text-sm text-red-600">
            {errors[key]}
          </p>
        )}
      </div>
    );
  };

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="form-title" className="fixed inset-0 z-50 flex flex-col bg-white md:flex-row">
      {/* Left: live preview */}
      <aside className="relative flex shrink-0 flex-col justify-between overflow-hidden bg-teal-900 p-8 text-white md:w-5/12 md:p-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-teal-700/40" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-teal-800/60" />

        <div className="relative">
          <p className="text-2xl  text-black">Employee Directory</p>
          <h1 id="form-title" className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            {editing ? 'Edit team member' : 'Add a new team member'}
          </h1>
          {/* <p className="mt-3 max-w-sm text-teal-100/80">
            {editing
              ? 'Update the details and save. Changes show up in the directory right away.'
              : 'Fill in the details on the right. The card below updates as you type.'}
          </p> */}
        </div>

        {/* <div className="relative mt-10 rounded-2xl bg-white p-6 text-slate-800 shadow-2xl md:mt-0">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-teal-700 text-xl font-semibold text-white">
              {initials(form.name)}
            </div>
            <div className="min-w-0">
              <p className={`truncate text-lg font-semibold ${form.name.trim() ? '' : 'text-slate-300'}`}>
                {form.name.trim() || 'Full name'}
              </p>
              <p className={`truncate text-sm ${form.role.trim() ? 'text-teal-700' : 'text-slate-300'}`}>
                {form.role.trim() || 'Job role'}
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm">
            <Icon name="email" className="shrink-0 text-slate-400" />
            <span className={`truncate ${form.email.trim() ? 'text-slate-600' : 'text-slate-300'}`}>
              {form.email.trim() || 'name@company.com'}
            </span>
          </div>
        </div> */}
      </aside>

      {/* Right: form */}
      <section className="relative flex-1 overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 rounded-full border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <form onSubmit={handleSubmit} noValidate className="mx-auto flex min-h-full max-w-lg flex-col justify-center gap-6 px-6 py-16">
          <div>
            <h2 className="text-2xl font-semibold">Employee details</h2>
            <p className="mt-1 text-slate-500">All fields are required.</p>
          </div>

          {field('name', 'Full name', 'e.g. Tejal Dalvi')}
          {field('email', 'Work email', 'name@company.com', 'email')}
          {field('role', 'Job role', 'e.g. Frontend Developer')}

          <div className="-mt-2 flex flex-wrap gap-2">
            {roleSuggestions.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => {
                  setForm({ ...form, role: r });
                  setTouched({ ...touched, role: true });
                }}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                  form.role === r
                    ? 'border-teal-700 bg-teal-50 text-teal-800'
                    : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="mt-2 flex items-center gap-3">
            <button
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal-700 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60"
            >
              {saving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
              {editing ? 'Save changes' : 'Add employee'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-300 px-6 py-3.5 text-base font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
          <p className="text-center text-xs text-slate-400">Press Esc to close</p>
        </form>
      </section>
    </div>
  );
}