import { FaBell, FaSearch } from "react-icons/fa";
import UserMenu from "./UserMenu";

export default function Navbar() {
  return (
    <header className="navbar">

      <div className="search-box">
        <FaSearch />

        <input
          type="text"
          aria-label="Search research papers"
          placeholder="Search research papers..."
        />
      </div>

      <div className="nav-right">

        <button
          type="button"
          className="nav-icon"
          aria-label="Notifications"
        >
          <FaBell aria-hidden="true" />
        </button>

        <UserMenu />

      </div>

    </header>
  );
}