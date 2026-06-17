import { useState } from "react";
import api from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const register = async () => {
  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
      await api.post("/auth/register", {
        email,
        password,
      });

      alert("Registration Successful");
    } catch {
      alert("Registration Failed");
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
        <h1>📝 Register</h1>

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
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "18px",
  }}
/>

<input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  style={{
    width: "100%",
    padding: "15px",
    marginTop: "15px",
    borderRadius: "12px",
    border: "none",
    outline: "none",
    fontSize: "18px",
  }}
/>

        <button
          onClick={register}
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
          Register
        </button>
      </div>
    </div>
  );
}