import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import apiClient from "../api/client";
import CellularMotif from "../components/CellularMotif";

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
  <div style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-8) var(--space-5) 0" }}>
    <CellularMotif size={80} />
    <div className="panel-accent" style={{ marginTop: "var(--space-5)" }}>
      <p className="eyebrow">New member</p>
      <h1>Create account</h1>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="field">
          <label>Enrollment Token</label>
          <input type="text" value={enrollmentToken} onChange={(e) => setEnrollmentToken(e.target.value)} required />
        </div>
        {error && <p style={{ color: "var(--color-error)", fontSize: "var(--text-sm)" }}>{error}</p>}
        <button type="submit" className="btn btn-full">Register</button>
      </form>
    </div>
  </div>
);
}

export default Register;