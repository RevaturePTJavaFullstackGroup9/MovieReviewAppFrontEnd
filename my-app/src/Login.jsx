import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`/api/users/search?username=${form.username}`);
      if (!res.ok) throw new Error("User not found");
      const user = await res.json();

      if (user.password !== form.password) throw new Error("Invalid password");
      if (user.status === "BANNED") throw new Error("Your account is banned.");

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>

      {error && <p className="error">{error}</p>}

      <p>
        Don’t have an account?{" "}
        <Link to="/register" style={{ color: "#0b5cff" }}>Register</Link>
      </p>

      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
}
