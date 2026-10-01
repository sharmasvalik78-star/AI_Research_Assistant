import { useState, useRef, useEffect } from "react";
import {
  FaUserCircle,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      ref={menuRef}
      style={{ position: "relative" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Open user menu"
        aria-expanded={open}
        aria-haspopup="menu"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          background: "none",
          border: "none",
          padding: 0,
        }}
      >
        <FaUserCircle size={36} />

        <div>
          <div style={{ fontWeight: "bold" }}>
            {user?.full_name}
          </div>

          <div
            style={{
              fontSize: "13px",
              color: "#666",
            }}
          >
            {user?.email}
          </div>
        </div>
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "55px",
            width: "220px",
            background: "white",
            borderRadius: "10px",
            boxShadow: "0 10px 25px rgba(0,0,0,.15)",
            overflow: "hidden",
            zIndex: 100,
          }}
        >
          <button
            style={buttonStyle}
            onClick={toggleDarkMode}
          >
            {darkMode ? <FaSun /> : <FaMoon />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button
            style={buttonStyle}
            onClick={() => navigate("/profile")}
          >
            <FaUser />
            My Profile
          </button>

          <button
            style={buttonStyle}
            onClick={() => navigate("/settings")}
          >
            <FaCog />
            Settings
          </button>

          <button
            style={buttonStyle}
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "14px 18px",
  border: "none",
  outline: "2px solid transparent",
  outlineOffset: "2px",
 background: "var(--menu-bg, white)",
  color: "var(--menu-text, #111827)",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  fontSize: "15px",
};