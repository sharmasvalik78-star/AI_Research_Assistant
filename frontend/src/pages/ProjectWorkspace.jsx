import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";

import { getProjectDocuments } from "../services/documentService";
import ProjectChatWorkspace from "../components/projects/ProjectChatWorkspace";
import ProjectResearchNotes from "../components/projects/ProjectResearchNotes";
import ProjectReportsWorkspace from "../components/projects/ProjectReportsWorkspace";
import ResearchTimeline from "../components/projects/ResearchTimeline";
import KnowledgeGraph from "../components/projects/KnowledgeGraph";
import ResearchGapDetection from "../components/projects/ResearchGapDetection";
import ResearchPresentation from "../components/projects/ResearchPresentation";
import SemanticSearch from "../components/projects/SemanticSearch";
import ResearchMethodology from "../components/projects/ResearchMethodology";
import ResearchQuestionGenerator from "../components/projects/ResearchQuestionGenerator";

export default function ProjectWorkspace() {
  const { projectId } = useParams();

  const [activeSection, setActiveSection] = useState("documents");
  const [documents, setDocuments] = useState([]);
  const [loadingDocuments, setLoadingDocuments] = useState(true);

  const cards = [
    {
      id: "documents",
      icon: "📄",
      title: "Documents",
      description: "Upload, organize and manage your research files.",
    },
    {
      id: "chats",
      icon: "💬",
      title: "AI Chat",
      description: "Research with Gemini using your uploaded documents.",
    },
    {
      id: "notes",
      icon: "📝",
      title: "Research Notes",
      description: "Store important AI findings and observations.",
    },
    {
      id: "reports",
      icon: "📊",
      title: "Research Reports",
      description: "Generate and share public AI research reports.",
    },
    {
      id: "timeline",
      icon: "🗓️",
      title: "Research Timeline",
      description:
        "Generate a chronological timeline from your research documents.",
    },
    {
      id: "knowledge-graph",
      icon: "🕸️",
      title: "Knowledge Graph",
      description:
        "Explore concepts and relationships across your research documents.",
    },
    {
      id: "research-gaps",
      icon: "🔍",
      title: "Research Gap Detection",
      description:
        "Identify research gaps, limitations, unanswered questions, and future research directions.",
    },
    {
      id: "research-presentation",
      icon: "📊",
      title: "AI Research Presentation",
      description:
        "Generate an academic presentation outline from your research documents.",
    },
    {
      id: "semantic-search",
      icon: "🔎",
      title: "Semantic Search",
      description:
        "Search semantically across all your research documents and projects.",
    },
    {
      id: "research-questions",
      icon: "❓",
      title: "Research Question Generator",
      description:
        "Generate meaningful research questions from your research documents.",
    },
    {
      id: "research-methodology",
      icon: "🔬",
      title: "Research Methodology",
      description:
        "Generate a structured research methodology from your research documents.",
    },
  ];

  useEffect(() => {
  const fetchProjectDocuments = async () => {
    try {
      setLoadingDocuments(true);
      const data = await getProjectDocuments(projectId);
      setDocuments(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load project documents.");
    } finally {
      setLoadingDocuments(false);
    }
  };

  fetchProjectDocuments();
}, [projectId]);

  const isChatOpen = activeSection === "chats";

  return (
    <div
      className={`project-workspace-page bg-slate-50 dark:bg-slate-950 ${
        isChatOpen
          ? "h-[calc(100vh-66px)] overflow-hidden"
          : "min-h-screen"
      }`}
    >
      <div
        className={`max-w-7xl mx-auto ${
          isChatOpen
            ? "h-full px-6 py-4"
            : "px-6 py-8"
        }`}
      >
        {!isChatOpen && (
          <>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
            >
              ← Back to Projects
            </Link>

            <div className="mt-8 mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Project Workspace
                </h1>

                <p className="mt-3 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
                  Manage documents, AI conversations, research notes, and
                  reports from one premium workspace.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 px-6 py-5 shadow-sm">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Workspace Modules
                </p>

                <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
                  {cards.length}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => setActiveSection(card.id)}
                  className={`group flex min-h-[230px] flex-col rounded-3xl border p-7 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    activeSection === card.id
                      ? "border-blue-600 bg-white text-slate-900 shadow-xl ring-1 ring-blue-100 dark:bg-slate-900 dark:text-white dark:ring-blue-900"
                      : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-4xl transition-all group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900">
                    {card.icon}
                  </div>

                  <h2
                    className={`mt-5 text-2xl font-bold ${
                     activeSection === card.id
                        ? "text-slate-800 dark:text-slate-300"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {card.title}
                  </h2>

                  <p
                    className={`mt-3 leading-7 ${
                      activeSection === card.id
                        ? "text-slate-300"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {card.description}
                  </p>

                  <div className="mt-auto pt-8 font-semibold text-blue-600">
                    Open →
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {isChatOpen && (
          <div className="h-full min-h-0">
            <ProjectChatWorkspace projectId={projectId} />
          </div>
        )}

        {!isChatOpen && (
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 p-8 shadow-sm">
            {activeSection === "documents" && (
              <>
                <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">
                  Documents
                </h2>

                {loadingDocuments ? (
                  <p className="text-slate-500 dark:text-slate-400">
                    Loading documents...
                  </p>
                ) : documents.length === 0 ? (
                  <p className="text-slate-500 dark:text-slate-400">
                    No documents uploaded yet.
                  </p>
                ) : (
                  <div className="space-y-5">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 p-5 transition hover:shadow-md"
                      >
                        <div>
                          <h3 className="font-semibold text-lg text-slate-900 dark:text-white">
                            📄 {doc.filename}
                          </h3>

                          <p className="mt-2 text-slate-500 dark:text-slate-400">
                            {doc.content_type}
                          </p>
                        </div>

                        <div className="text-sm text-slate-400 dark:text-slate-500">
                          {new Date(doc.uploaded_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "notes" && (
              <ProjectResearchNotes projectId={projectId} />
            )}

            {activeSection === "reports" && (
              <ProjectReportsWorkspace projectId={projectId} />
            )}

            {activeSection === "timeline" && (
              <ResearchTimeline
                projectId={projectId}
                documents={documents}
              />
            )}

            {activeSection === "knowledge-graph" && (
              <KnowledgeGraph
                projectId={projectId}
                documents={documents}
              />
            )}

            {activeSection === "research-gaps" && (
              <ResearchGapDetection
                projectId={projectId}
                documents={documents}
              />
            )}

            {activeSection === "research-presentation" && (
              <ResearchPresentation
                projectId={projectId}
                documents={documents}
              />
            )}

            {activeSection === "semantic-search" && <SemanticSearch />}

            {activeSection === "research-questions" && (
              <ResearchQuestionGenerator
                projectId={projectId}
                documents={documents}
              />
            )}

            {activeSection === "research-methodology" && (
              <ResearchMethodology
                projectId={projectId}
                documents={documents}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}