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
    <div style={{ maxWidth: "420px", margin: "80px auto", padding: "0 24px" }}>
      <div style={{ borderLeft: "4px solid var(--color-blue)", paddingLeft: "20px" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 4px 0" }}>
          Welcome back
        </p>
        <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Log in</h1>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p style={{ color: "var(--color-error)", fontSize: "0.9rem", marginBottom: "16px" }}>
              {error}
            </p>
          )}
          <button type="submit" style={{ width: "100%" }}>Log In</button>
        </form>
      </div>
    </div>
  );
}

export default Login;