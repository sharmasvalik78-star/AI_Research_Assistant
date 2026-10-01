export default function ProjectRenameForm({
  editingProject,
  editName,
  editDescription,
  onNameChange,
  onDescriptionChange,
  onSave,
  onCancel,
}) {
  if (!editingProject) {
    return null;
  }

  return (
    <form
      onSubmit={onSave}
      className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 mb-8 space-y-4"
    >
      <h2 className="text-xl font-semibold">
        Rename Project
      </h2>

      <label
        htmlFor="rename-project-name"
        className="block text-sm font-semibold text-slate-700"
      >
        Project Name
      </label>

      <input
        id="rename-project-name"
        type="text"
        value={editName}
        onChange={(e) => onNameChange(e.target.value)}
        className="w-full border rounded px-4 py-2"
      />

      <label
        htmlFor="rename-project-description"
        className="block text-sm font-semibold text-slate-700"
      >
        Description
      </label>

      <textarea
        id="rename-project-description"
        rows={3}
        value={editDescription}
        onChange={(e) => onDescriptionChange(e.target.value)}
        className="w-full border rounded px-4 py-2"
      />

      <div className="flex gap-3">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}