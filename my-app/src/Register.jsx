import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const handleSubmit = (event, form, navigate) => {
    event.preventDefault();

    const signupRequestObject = {
        "username": form.username,
        "email": form.email,
        "password": form.password,
        "role": "USER"
    }

    axios.post(`http://localhost:8080/api/auth/signup`, signupRequestObject)
        .then(
            response => {
                if (response.status != 200){
                    throw new Error(`Error signing up, expected 200 status code, but recieved ${response.status}`);
                }
                console.log(`Succesfully signed up! Server Response= "${response.data.message}", Status=${response.status}`)
                setTimeout( () => {
                    navigate("/login")
                }, 3000)
            }
        )
        .catch(error => {
            if (error.response){
                console.error(`Server responded with an error. Raw Data=${JSON.stringify(error.response.data)}, status code: ${error.response.status}`)
            }
            else if (error.request){
                console.error(`No response received from server!`)
            }
            else{
                console.error(`Unexpected error occorued during signup, error="${error}"`)
            }
        })
};

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Registration failed");
      }

      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
    }
  };
  */

  return (
    <div className="auth-container">
      <h2>Create an Account</h2>
      <form onSubmit={e => handleSubmit(e, form, navigate)} className="auth-form">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
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
        <button type="submit">Register</button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <p>
        Already have an account?{" "}
        <Link to="/login" style={{ color: "#0b5cff" }}>Login</Link>
      </p>

      <Link to="/" className="back-link">← Back to Home</Link>
    </div>
  );
}
