import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "./components/Context/UserContext";
import axios from "axios";

const handleSubmit = (event, form, navigate, setUser) => {
    event.preventDefault();

    const loginRequest = {
        "username": form.username,
        "password": form.password
    };

    axios.post("http://localhost:8080/api/auth/login", loginRequest)
        .then(
            response => {
                console.log(`Succesfully logged in! Response= ${JSON.stringify(response.data)}`)
                // Set Auth Token Globally here
                console.log(response.data);
                const user = {
                    id: response.data.id,
                    email: response.data.email,
                    token: response.data.token,
                    username: response.data.username,
                    role: response.data.role,
                };
                setUser(user);
                setTimeout( () => {navigate("/")}, 3000);
            }
        )
        .catch(
            error => {
                if (error.response){
                    console.error(`Server responded with an error. Raw Data=${JSON.stringify(error.response.data)}, status code: ${error.response.status}`)
                }
                else if (error.request){
                    console.error(`No response received from server!`)
                }
                else{
                    console.error(`Unexpected error occured during signin, error="${error}"`)
                }
            }
        )
};

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const {setUser} = React.useContext(UserContext);

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      //const res = await fetch(`/api/users/search?username=${form.username}`);
      response = await axios.post()
      if (!res.ok) throw new Error("User not found");
      const user = await res.json();

      if (user.password !== form.password) throw new Error("Invalid password");
      //if (user.status === "BANNED") throw new Error("Your account is banned.");

      alert("Login successful!");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };
  */

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={ e => handleSubmit(e, form, navigate, setUser)} className="auth-form">
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
