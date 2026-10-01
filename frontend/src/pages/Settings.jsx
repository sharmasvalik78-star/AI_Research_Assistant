import { useEffect, useState } from "react";
import {
  FaMoon,
  FaSun,
  FaSave,
  FaUser,
  FaEnvelope,
} from "react-icons/fa";
import toast from "react-hot-toast";

import { useTheme } from "../context/ThemeContext";
import { useAuthContext } from "../context/AuthContext";

import "./Settings.css";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useTheme();
  const { user } = useAuthContext();

  const [autoSave, setAutoSave] = useState(() => {
    return localStorage.getItem("settings_auto_save") !== "false";
  });

  const [compactMode, setCompactMode] = useState(() => {
    return localStorage.getItem("settings_compact_mode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("settings_auto_save", autoSave);
  }, [autoSave]);

  useEffect(() => {
    localStorage.setItem("settings_compact_mode", compactMode);
  }, [compactMode]);

  useEffect(() => {
    document.documentElement.classList.toggle(
      "compact-mode",
      compactMode
    );

    return () => {
      document.documentElement.classList.remove("compact-mode");
    };
  }, [compactMode]);

  const handleSave = () => {
    localStorage.setItem("settings_auto_save", autoSave);
    localStorage.setItem("settings_compact_mode", compactMode);

    toast.success("Settings saved successfully");
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your application preferences.</p>
        </div>

        <button
          type="button"
          className="settings-save-button"
          onClick={handleSave}
        >
          <FaSave aria-hidden="true" />
          <span>Save Settings</span>
        </button>
      </div>

      <div className="settings-container">
        {/* Account */}
        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Account</h2>
            <p>Your current account information.</p>
          </div>

          <div className="settings-account">
            <div className="settings-account-icon">
              <FaUser aria-hidden="true" />
            </div>

            <div className="settings-account-details">
              <div className="settings-account-item">
                <span>Name</span>
                <strong>
                  {user?.full_name ||
                    user?.name ||
                    user?.username ||
                    "User"}
                </strong>
              </div>

              <div className="settings-account-item">
                <span>Email</span>
                <div className="settings-email">
                  <FaEnvelope aria-hidden="true" />
                  <strong>
                    {user?.email || "Email unavailable"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Appearance */}
        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Appearance</h2>
            <p>Customize how the application looks.</p>
          </div>

          <div className="settings-option">
            <div className="settings-option-info">
              <div className="settings-option-icon">
                {darkMode ? (
                  <FaMoon aria-hidden="true" />
                ) : (
                  <FaSun aria-hidden="true" />
                )}
              </div>

              <div>
                <h3>Dark Mode</h3>
                <p>
                  {darkMode
                    ? "Dark mode is currently enabled."
                    : "Light mode is currently enabled."}
                </p>
              </div>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
              <span className="settings-slider"></span>
            </label>
          </div>
        </section>

        {/* Preferences */}
        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Preferences</h2>
            <p>Control application behavior.</p>
          </div>

          <div className="settings-option">
            <div className="settings-option-info">
              <div>
                <h3>Auto Save</h3>
                <p>
                  Automatically save supported research changes.
                </p>
              </div>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(event) =>
                  setAutoSave(event.target.checked)
                }
                aria-label="Toggle auto save"
              />
              <span className="settings-slider"></span>
            </label>
          </div>

          <div className="settings-option">
            <div className="settings-option-info">
              <div>
                <h3>Compact Mode</h3>
                <p>
                  Use a more compact layout for application content.
                </p>
              </div>
            </div>

            <label className="settings-switch">
              <input
                type="checkbox"
                checked={compactMode}
                onChange={(event) =>
                  setCompactMode(event.target.checked)
                }
                aria-label="Toggle compact mode"
              />
              <span className="settings-slider"></span>
            </label>
          </div>
        </section>

        {/* Application */}
        <section className="settings-section">
          <div className="settings-section-header">
            <h2>Application</h2>
            <p>Information about your research assistant.</p>
          </div>

          <div className="settings-info-grid">
            <div className="settings-info-item">
              <span>Application</span>
              <strong>AI Research Assistant Pro</strong>
            </div>

            <div className="settings-info-item">
              <span>Version</span>
              <strong>v1.0</strong>
            </div>

            <div className="settings-info-item">
              <span>Platform</span>
              <strong>Web Application</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}