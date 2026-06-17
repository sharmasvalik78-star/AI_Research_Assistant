import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.access_token
      );

      navigate("/");
    } catch (err) {
      alert("Invalid Credentials");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.08)",
          padding: "40px",
          borderRadius: "20px",
          width: "450px",
          textAlign: "center",
          color: "white",
        }}
      >
        <h1>🔐 Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "20px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "15px",
            marginTop: "15px",
            borderRadius: "10px",
            border: "none",
            outline: "none",
          }}
        />

        <button
          onClick={login}
          style={{
            marginTop: "20px",
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "15px 30px",
            borderRadius: "10px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
}