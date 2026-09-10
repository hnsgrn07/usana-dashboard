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
    <div style={{ maxWidth: "500px", margin: "40px auto", textAlign: "center" }}>
      <h1>Member Enrollment</h1>
      <p>Generate a QR code for a new member to scan and register.</p>

      <button onClick={handleGenerate}>Generate Enrollment QR</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {token && (
        <div style={{ marginTop: "24px" }}>
          <img
            src={`${apiClient.defaults.baseURL}/enrollment/qr/${token}`}
            alt="Enrollment QR code"
            style={{ border: "1px solid #ccc", padding: "8px" }}
          />
          <p style={{ marginTop: "12px", wordBreak: "break-all" }}>
            <strong>Enrollment link:</strong><br />
            {enrollmentUrl}
          </p>
          <p style={{ fontSize: "0.85em", color: "#888" }}>
            This token can only be used once — scanning or visiting this link
            takes a new member to registration.
          </p>
        </div>
      )}
    </div>
  );
}

export default Enroll;