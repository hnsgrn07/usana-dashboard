// The top-level app: wires up pages by URL, and for now just proves
// the frontend can actually talk to the backend
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import apiClient from "./api/client";

function Home() {
  const [message, setMessage] = useState("Loading...");

  // Runs once when the page loads, asks the backend for its welcome message
  useEffect(() => {
    apiClient.get("/")
      .then((response) => setMessage(response.data.message))
      .catch(() => setMessage("Could not reach the backend"));
  }, []);

  return <h1>{message}</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;