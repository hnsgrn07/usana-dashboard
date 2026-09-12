import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { saveToken } from "../auth";
import CellularMotif from "../components/CellularMotif";

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
  <div style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-8) var(--space-5) 0" }}>
    <CellularMotif size={80} />
    <div className="panel-accent blue" style={{ marginTop: "var(--space-5)" }}>
      <p className="eyebrow">Welcome back</p>
      <h1>Log in</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: "var(--color-error)", fontSize: "var(--text-sm)" }}>{error}</p>}
        <button type="submit" className="btn btn-full">Log In</button>
      </form>
    </div>
  </div>
);
}

export default Login;