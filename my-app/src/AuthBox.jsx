// src/components/AuthBox.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AuthBox({ className = "", style = {} }) {
  const navigate = useNavigate();

  return (
    <div
      className={className}
      style={{
        maxWidth: 520,
        margin: "18px auto",
        padding: 18,
        borderRadius: 10,
        boxShadow: "0 6px 30px rgba(0,0,0,0.08)",
        background: "linear-gradient(180deg, #ffffff, #fbfbff)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        alignItems: "stretch",
        ...style
      }}
    >
      <h2 style={{ margin: 0, marginBottom: 6, fontSize: 20, textAlign: "center" }}>
        Sign in or Register
      </h2>
      

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 8 }}>
        <button
          onClick={() => navigate("/login")}
          style={buttonStyle}
          aria-label="Login"
        >
          Login
        </button>

        <button
          onClick={() => navigate("/register")}
          style={{ ...buttonStyle, background: "white", color: "#0b5cff", border: "1px solid #d6e0ff" }}
          aria-label="Register"
        >
          Register
        </button>

        <button
          onClick={() => navigate("/admin")}
          style={{ ...buttonStyle, background: "#111827", color: "#fff" }}
          aria-label="Admin"
        >
          Admin
        </button>
      </div>

      
    </div>
  );
}

const buttonStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  background: "#0b5cff",
  color: "#fff",
  boxShadow: "0 4px 12px rgba(11,92,255,0.12)",
  minWidth: 92,
  transition: "transform 120ms ease, box-shadow 120ms ease"
};
