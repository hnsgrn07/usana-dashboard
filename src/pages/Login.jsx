// Login.jsx
// Lets an existing user log in and stores their token for future requests
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { saveToken } from "../auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/login", { email, password });
      saveToken(response.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Log In</button>
      </form>
    </div>
  );
}

export default Login;