import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import apiClient from "./api/client";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Enroll from "./pages/Enroll";
import CellularMotif from "./components/CellularMotif";

function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    apiClient.get("/")
      .then((response) => setMessage(response.data.message))
      .catch(() => setMessage("Could not reach the backend"));
  }, []);

  return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "var(--space-8) var(--space-5) 0" }}>
      <CellularMotif />
      <p className="eyebrow" style={{ marginTop: "var(--space-5)" }}>USANA Personal Coach</p>
      <h1>Your daily dose, decided for you.</h1>
      <p style={{ color: "var(--color-gray)" }}>{message}</p>
      <div style={{ display: "flex", gap: "var(--space-5)", flexWrap: "wrap", marginTop: "var(--space-5)" }}>
        <Link to="/register">Register</Link>
        <Link to="/login">Log In</Link>
        <Link to="/enroll">Generate Enrollment QR</Link>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;