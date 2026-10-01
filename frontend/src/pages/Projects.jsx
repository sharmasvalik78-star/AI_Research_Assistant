import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "./Projects.css";

import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/projectService";

import ProjectCreateForm from "../components/projects/ProjectCreateForm";
import ProjectRenameForm from "../components/projects/ProjectRenameForm";
import ProjectGrid from "../components/projects/ProjectGrid";

export default function Projects() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editingProject, setEditingProject] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  fetchProjects();
}, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Project name is required.");
      return;
    }

    try {
      await createProject({
        name,
        description,
      });

      toast.success("Project created.");

      setName("");
      setDescription("");

      loadProjects();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Failed to create project."
      );
    }
  };

  const openRename = (project) => {
    setEditingProject(project);
    setEditName(project.name);
    setEditDescription(project.description || "");
  };

  const handleRename = async (e) => {
    e.preventDefault();

    if (!editName.trim()) {
      toast.error("Project name is required.");
      return;
    }

    try {
      await updateProject(editingProject.id, {
        name: editName,
        description: editDescription,
      });

      toast.success("Project updated.");

      setEditingProject(null);
      setEditName("");
      setEditDescription("");

      loadProjects();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Failed to update project."
      );
    }
  };

  const handleDelete = async (project) => {
    const confirmed = window.confirm(
      `Delete project "${project.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProject(project.id);

      toast.success("Project deleted.");

      if (
        editingProject &&
        editingProject.id === project.id
      ) {
        setEditingProject(null);
        setEditName("");
        setEditDescription("");
      }

      loadProjects();
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.detail ||
          "Failed to delete project."
      );
    }
  };

  const handleOpenProject = (project) => {
    navigate(`/projects/${project.id}`);
  };

  return (
  <div className="projects-page min-h-screen bg-slate-50 dark:bg-slate-950">
    <div className="max-w-7xl mx-auto px-6 py-8">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
            Research Projects
          </h1>

          <p className="mt-2 text-slate-600 dark:text-slate-300 text-lg">
            Organize your AI research into dedicated workspaces.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-5 py-4 shadow-sm">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Total Projects
          </p>

          <p className="text-3xl font-bold text-slate-900 dark:text-white">
            {projects.length}
          </p>
        </div>
      </div>

      {/* Create Project */}
      <div className="mb-8 rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-sm">
        <ProjectCreateForm
          name={name}
          description={description}
          onNameChange={setName}
          onDescriptionChange={setDescription}
          onSubmit={handleCreate}
        />
      </div>

      {/* Rename Project */}
      {editingProject && (
        <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950/40 p-6 shadow-sm">
          <ProjectRenameForm
            editingProject={editingProject}
            editName={editName}
            editDescription={editDescription}
            onNameChange={setEditName}
            onDescriptionChange={setEditDescription}
            onSave={handleRename}
            onCancel={() => setEditingProject(null)}
          />
        </div>
      )}

      {/* Projects */}
      <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-6 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-10 w-10 mx-auto mb-4 animate-spin rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-slate-900 dark:border-t-white"></div>

              <p className="text-slate-600 dark:text-slate-300">
                Loading projects...
              </p>
            </div>
          </div>
        ) : (
          <ProjectGrid
            projects={projects}
            onOpen={handleOpenProject}
            onRename={openRename}
            onDelete={handleDelete}
          />
        )}
      </div>

    </div>
  </div>
);
}