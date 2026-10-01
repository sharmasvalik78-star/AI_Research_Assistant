import useAuth from "../hooks/useAuth";

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 px-6 py-10 dark:bg-slate-950">
      <h1 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
        My Profile
      </h1>

      <br />

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Full Name
        </h3>
        <p className="text-lg font-medium text-slate-900 dark:text-white">
          {user?.full_name}
        </p>
      </div>

      <br />

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Email
        </h3>
        <p className="text-lg font-medium text-slate-900 dark:text-white">
          {user?.email}
        </p>
      </div>
    </div>
  );
}