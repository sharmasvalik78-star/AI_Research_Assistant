export default function NotFound() {
    return (
    <div className="flex min-h-[70vh] items-center justify-center px-6">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-6xl font-bold tracking-tight text-slate-900">
          404
        </p>

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-2 text-slate-500">
          The page you are looking for does not exist or may have been moved.
        </p>
      </div>
    </div>
  );
}