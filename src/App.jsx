import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import apiClient from "./api/client";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Enroll from "./pages/Enroll";

function Home() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    apiClient.get("/")
      .then((response) => setMessage(response.data.message))
      .catch(() => setMessage("Could not reach the backend"));
  }, []);

  return (
    <div style={{ maxWidth: "480px", margin: "80px auto", padding: "0 24px" }}>
      <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 4px 0" }}>
        USANA Personal Coach
      </p>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "24px" }}>Your daily dose, decided for you.</h1>
      <p style={{ marginBottom: "32px" }}>{message}</p>
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
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