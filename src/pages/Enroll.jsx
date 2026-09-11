// Enroll.jsx
// Generates a new enrollment token and shows it as a scannable QR code
import { useState } from "react";
import apiClient from "../api/client";


function Enroll() {
  const [token, setToken] = useState(null);
  const [enrollmentUrl, setEnrollmentUrl] = useState(null);
  const [error, setError] = useState("");

  // Asks the backend for a new token, then builds the QR image URL from it
  async function handleGenerate() {
    setError("");
    try {
      const response = await apiClient.post("/enrollment/generate");
      setToken(response.data.token);
      setEnrollmentUrl(response.data.enrollment_url);
    } catch (err) {
      setError("Could not generate a token. Is the backend running?");
    }
  }

  return (
  <div style={{ maxWidth: "480px", margin: "80px auto", padding: "0 24px", textAlign: "center" }}>
    <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 4px 0" }}>
      For Associates
    </p>
    <h1 style={{ fontSize: "2rem", marginBottom: "12px" }}>Member Enrollment</h1>
    <p style={{ color: "var(--color-gray)", marginBottom: "32px" }}>
      Generate a QR code for a new member to scan and register.
    </p>

    <button onClick={handleGenerate}>Generate Enrollment QR</button>

    {error && (
      <p style={{ color: "var(--color-error)", fontSize: "0.9rem", marginTop: "16px" }}>
        {error}
      </p>
    )}

    {token && (
      <div
        style={{
          marginTop: "32px",
          borderLeft: "4px solid var(--color-navy)",
          backgroundColor: "white",
          padding: "24px",
          textAlign: "left",
        }}
      >
        <img
          src={`${apiClient.defaults.baseURL}/enrollment/qr/${token}`}
          alt="Enrollment QR code"
          style={{ display: "block", margin: "0 auto 20px auto" }}
        />
        <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "0 0 16px 0" }} />
        <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 4px 0" }}>
          Enrollment link
        </p>
        <p style={{ wordBreak: "break-all", fontSize: "0.9rem", margin: "0 0 16px 0" }}>
          {enrollmentUrl}
        </p>
        <p style={{ fontSize: "0.8rem", color: "var(--color-gray)", margin: 0 }}>
          This token can only be used once — scanning or visiting this link
          takes a new member to registration.
        </p>
      </div>
    )}
  </div>
);
}

export default Enroll;