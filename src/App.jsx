// App.jsx
// Wires up which page shows for which URL
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import apiClient from "./api/client";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function Home() {
  const [message, setMessage] = useState("Loading...");

  // Runs once when the page loads, asks the backend for its welcome message
  useEffect(() => {
    apiClient.get("/")
      .then((response) => setMessage(response.data.message))
      .catch(() => setMessage("Could not reach the backend"));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>{message}</h1>
      <p>
        <Link to="/register">Register</Link> | <Link to="/login">Log In</Link>
      </p>
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