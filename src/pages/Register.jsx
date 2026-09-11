import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api/client";

function Register() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [enrollmentToken, setEnrollmentToken] = useState(searchParams.get("token") || "");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post("/register", {
        email: email,
        password: password,
        enrollment_token: enrollmentToken,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong");
    }
  }

  return (
    <div style={{ maxWidth: "420px", margin: "80px auto", padding: "0 24px" }}>
      <div style={{ borderLeft: "4px solid var(--color-navy)", paddingLeft: "20px" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 4px 0" }}>
          New member
        </p>
        <h1 style={{ fontSize: "2rem", marginBottom: "24px" }}>Create account</h1>

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
          <div style={{ marginBottom: "16px" }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label>Enrollment Token</label>
            <input
              type="text"
              value={enrollmentToken}
              onChange={(e) => setEnrollmentToken(e.target.value)}
              required
            />
          </div>
          {error && (
            <p style={{ color: "var(--color-error)", fontSize: "0.9rem", marginBottom: "16px" }}>
              {error}
            </p>
          )}
          <button type="submit" style={{ width: "100%" }}>Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;