import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUpload,
  FaFolderOpen,
  FaComments,
  FaStickyNote,
  FaChartBar,
  FaFileAlt,
  FaCog,
  FaProjectDiagram,
} from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();

  const menus = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Projects",
      path: "/projects",
      icon: <FaProjectDiagram />,
    },
    {
      name: "Upload",
      path: "/upload",
      icon: <FaUpload />,
    },
    {
      name: "My Documents",
      path: "/documents",
      icon: <FaFolderOpen />,
    },
    {
      name: "Research Chat",
      path: "/chat",
      icon: <FaComments />,
    },
    {
      name: "Research Notes",
      path: "/research-notes",
      icon: <FaStickyNote />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FaChartBar />,
    },
    {
      name: "Reports",
      path: "/reports",
      icon: <FaFileAlt />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <div className="sidebar">
      <div className="logo">
        <h1>AI Research</h1>
      </div>

      {menus.map((menu) => (
        <Link
          key={menu.path}
          to={menu.path}
          className={`menu focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            location.pathname === menu.path
              ? "active"
              : ""
          }`}
          aria-current={
            location.pathname === menu.path
              ? "page"
              : undefined
          }
        >
          {menu.icon}
          <span>{menu.name}</span>
        </Link>
      ))}
    </div>
  );
}