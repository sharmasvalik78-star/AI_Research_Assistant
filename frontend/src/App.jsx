import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Upload from "./pages/Upload";
import CodeGenerator from "./pages/CodeGenerator";
import Viva from "./pages/Viva";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Layout({ children }) {
  const token = localStorage.getItem("token");
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#020617",
      }}
    >
      <div
        style={{
          width: "280px",
          background: "#0f172a",
          borderRight: "1px solid #1e293b",
          padding: "24px",
        }}
      >
        <h2
          style={{
            fontSize: "24px",
            marginBottom: "40px",
            color: "#fff",
          }}
        >
          🤖 AI Research Assistant
        </h2>

        <nav
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  }}
>
  {token && (
    <>
      <Link style={linkStyle} to="/">
        🏠 Dashboard
      </Link>

      <Link style={linkStyle} to="/chat">
        💬 Research Chat
      </Link>

      <Link style={linkStyle} to="/upload">
        📄 Upload Documents
      </Link>

      <Link style={linkStyle} to="/code">
        ⚙️ Code Generator
      </Link>

      <Link style={linkStyle} to="/viva">
        🎓 Viva Generator
      </Link>
    </>
  )}

  {!token && (
  <>
    <Link style={linkStyle} to="/login">
      🔐 Login
    </Link>

    <Link style={linkStyle} to="/register">
      📝 Register
    </Link>
  </>
)}

  {token && (
    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }}
      style={{
        background: "#dc2626",
        color: "white",
        border: "none",
        padding: "16px",
        borderRadius: "12px",
        cursor: "pointer",
        fontSize: "16px",
      }}
    >
      🚪 Logout
    </button>
  )}
</nav>
      </div>

      <div
        style={{
          flex: 1,
          padding: "30px",
          overflow: "auto",
        }}
      >
        {children}
      </div>
    </div>
  );
}

const linkStyle = {
  textDecoration: "none",
  color: "white",
  background: "#1e293b",
  padding: "16px",
  borderRadius: "12px",
  fontSize: "16px",
  transition: "0.3s",
};

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
  window.location.href = "/login";
  return null;
}

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
  path="/"
  element={
    <ProtectedRoute>
      <Layout>
        <Dashboard />
      </Layout>
    </ProtectedRoute>
  }
/>

        <Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Layout>
        <Chat />
      </Layout>
    </ProtectedRoute>
  }
/>

       <Route
  path="/upload"
  element={
    <ProtectedRoute>
      <Layout>
        <Upload />
      </Layout>
    </ProtectedRoute>
  }
/>

        <Route
  path="/code"
  element={
    <ProtectedRoute>
      <Layout>
        <CodeGenerator />
      </Layout>
    </ProtectedRoute>
  }
/>

       <Route
  path="/viva"
  element={
    <ProtectedRoute>
      <Layout>
        <Viva />
      </Layout>
    </ProtectedRoute>
  }
/>
        <Route
  path="/login"
  element={
    <Layout>
      <Login />
    </Layout>
  }
/>

<Route
  path="/register"
  element={
    <Layout>
      <Register />
    </Layout>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}