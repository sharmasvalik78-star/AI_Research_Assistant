export default function ProjectCreateForm({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  onSubmit,
}) {
  return (
    <div className="mb-10">
      <form
        onSubmit={onSubmit}
        className="
        project-create-form
        bg-white
        border
        border-slate-200
        rounded-3xl
        shadow-sm
        p-8
        transition-all
        duration-300
        hover:shadow-xl
        hover:border-blue-200
        "
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Create New Project
          </h2>

          <p className="mt-1 text-slate-500">
            Organize your research documents, AI chats, and notes into a
            dedicated workspace.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <label
              htmlFor="project-name"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Project Name
            </label>

            <input
              id="project-name"
              type="text"
              placeholder="e.g. AI Research Assistant"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="
              w-full
              rounded-2xl
              border
              border-slate-300
              bg-slate-50
              px-4
              py-3.5
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition-all
              duration-200
              focus:bg-white
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              "
            />
          </div>

          <div>
            <label
              htmlFor="project-description"
              className="block mb-2 text-sm font-semibold text-slate-700"
            >
              Description
            </label>

            <textarea
              id="project-description"
              placeholder="Describe your research project (optional)..."
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={4}
              className="
              w-full
              resize-none
              rounded-2xl
              border
              border-slate-300
              bg-slate-50
              px-4
              py-3.5
              text-slate-900
              placeholder:text-slate-400
              outline-none
              transition-all
              duration-200
              focus:bg-white
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              "
            />
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6">
          <button
            type="submit"
            className="
              w-full
              rounded-2xl
              bg-gradient-to-r
              from-blue-600
              via-indigo-600
              to-violet-600
              px-6
              py-4
              text-base
              font-semibold
              text-white
              shadow-lg
              shadow-blue-200/60
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:shadow-xl
              active:scale-[0.98]
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              focus:ring-offset-2
            "
          >
            Create Project
          </button>
        </div>
      </form>
    </div>
  );
}