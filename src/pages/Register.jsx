// Register.jsx
// Lets someone create an account using an enrollment token (normally from a QR code)
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


  // Runs when the form is submitted
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      await apiClient.post("/register", {
        email: email,
        password: password,
        enrollment_token: enrollmentToken,
      });

      // Registration succeeded, send them to the login page
      navigate("/login");
    } catch (err) {
      // Show whatever error message the backend sent back
      setError(err.response?.data?.detail || "Something went wrong");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto" }}>
      <h1>Create Account</h1>
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
        <div>
          <label>Enrollment Token</label>
          <input
            type="text"
            value={enrollmentToken}
            onChange={(e) => setEnrollmentToken(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;