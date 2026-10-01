import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="app">
      <Sidebar />

      <div className="content">

        <Navbar />

        <div className="page">

          <Outlet />

        </div>

      </div>

    </div>
  );
}