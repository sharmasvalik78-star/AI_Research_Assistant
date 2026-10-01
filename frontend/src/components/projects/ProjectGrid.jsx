import ProjectCard from "./ProjectCard";

export default function ProjectGrid({
  projects,
  onOpen,
  onRename,
  onDelete,
}) {
  if (projects.length === 0) {
    return (
      <div className="flex min-h-[420px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-white p-10">
        <div className="max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-blue-100 text-5xl shadow-sm">
            📁
          </div>

          <h2 className="text-2xl font-bold text-slate-900">
            No Research Projects Yet
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Create your first research project to organize documents,
            AI conversations, citations, reports, and research notes
            in one beautiful workspace.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-7
        sm:grid-cols-2
        xl:grid-cols-3
        2xl:grid-cols-4
        items-stretch
      "
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onOpen={onOpen}
          onRename={onRename}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}