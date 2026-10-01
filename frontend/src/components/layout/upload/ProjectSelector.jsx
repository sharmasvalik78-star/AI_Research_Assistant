export default function ProjectSelector({
  projects,
  selectedProject,
  onChange,
  disabled = false,
}) {
  return (
    <div className="mb-6 text-left">
      <label
        htmlFor="research-project"
        className="block text-sm font-semibold text-gray-700 mb-2"
      >
        Research Project
      </label>

      <select
        id="research-project"
        value={selectedProject}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full rounded-xl border border-blue-200 bg-white px-4 py-3 text-slate-700 shadow-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-100"
      >
        <option value="">
          No Project (General Upload)
        </option>

        {projects.map((project) => (
          <option
            key={project.id}
            value={project.id}
          >
            {project.name}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-500 mt-2">
        Documents uploaded without a project will remain available in
        your general document library.
      </p>
    </div>
  );
}