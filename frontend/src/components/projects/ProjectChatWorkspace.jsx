import ResearchChat from "../../pages/ResearchChat";

export default function ProjectChatWorkspace({ projectId }) {
  return (
  <div className="project-chat-workspace">
    <ResearchChat projectId={projectId} />
  </div>
);
}