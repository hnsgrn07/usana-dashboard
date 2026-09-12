// Dashboard.jsx
// Shows the logged-in user's profile, AI coaching note, and recommendations,
// or a setup form if they haven't created a profile yet
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { clearToken } from "../auth";
import ProfileForm from "../components/ProfileForm";
import HabitTracker from "../components/HabitTracker";
import ProgressChart from "../components/ProgressChart";

const CATEGORY_COLORS = {
  Essentials: "var(--color-navy)",
  Optimizers: "var(--color-blue)",
  Foods: "var(--color-lightblue)",
};

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [coaching, setCoaching] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  // Find out who's logged in as soon as the page loads
  useEffect(() => {
    apiClient.get("/me")
      .then((response) => setUserId(response.data.user_id))
      .catch(() => {
        clearToken();
        navigate("/login");
      });
  }, [navigate]);

  // Once we know the user's id, try to load their saved profile
  useEffect(() => {
    if (!userId) return;

    apiClient.get(`/profile/${userId}`)
      .then((response) => {
        setProfile(response.data);
        loadRecommendations(userId);
        loadCoaching(userId);
      })
      .catch((err) => {
        if (err.response?.status === 404) {
          setProfile(null); // no profile saved yet, show the setup form instead
        }
      })
      .finally(() => setLoading(false));
  }, [userId]);

  function loadRecommendations(id) {
    apiClient.get(`/recommend/${id}`)
      .then((response) => setRecommendations(response.data))
      .catch(() => setRecommendations(null));
  }

  function loadCoaching(id) {
    apiClient.get(`/coach/${id}`)
      .then((response) => setCoaching(response.data.coaching_text))
      .catch(() => setCoaching(null));
  }

  function handleProfileSaved(savedProfile) {
    setProfile(savedProfile);
    setEditing(false);
    loadRecommendations(userId);
    loadCoaching(userId);
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: "80px" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "60px auto", padding: "0 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px" }}>
        <h1 style={{ margin: 0 }}>My Dashboard</h1>
        <div style={{ display: "flex", gap: "16px" }}>
          {profile && !editing && (
            <button
              onClick={() => setEditing(true)}
              style={{ backgroundColor: "transparent", color: "var(--color-blue)", padding: "8px 0" }}
            >
              Edit Profile
            </button>
          )}
          <button onClick={handleLogout} style={{ backgroundColor: "transparent", color: "var(--color-blue)", padding: "8px 0" }}>
            Log Out
          </button>
        </div>
      </div>

      {(!profile || editing) && (
        <ProfileForm onSaved={handleProfileSaved} initialData={editing ? profile : null} />
      )}

      {profile && !editing && (
        
        <div>
          <div style={{ borderLeft: "4px solid var(--color-navy)", paddingLeft: "20px", marginBottom: "32px" }}>
            <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 4px 0" }}>
              Member profile
            </p>
            <h2 style={{ fontSize: "1.75rem", margin: "0 0 8px 0" }}>Hi, {profile.full_name}</h2>
            <p style={{ margin: "4px 0", color: "var(--color-gray)" }}>
              Age {profile.age} · {profile.activity_level.replace(/_/g, " ")} activity
            </p>
            <p style={{ margin: "4px 0" }}>
              {profile.health_goals.map((g) => g.replace(/_/g, " ")).join(" · ")}
            </p>
          </div>

          <HabitTracker />
          <ProgressChart userId={userId} />

          {coaching && (
            <div
              style={{
                backgroundColor: "white",
                borderLeft: "4px solid var(--color-blue)",
                padding: "20px",
                marginBottom: "32px",
              }}
            >
              <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 8px 0" }}>
                Your Personal Coach
              </p>
              <p style={{ margin: 0, whiteSpace: "pre-line", lineHeight: 1.6 }}>{coaching}</p>
            </div>
          )}

          <h3 style={{ marginBottom: "16px" }}>Your Recommendations</h3>

          {recommendations?.status === "no_matches" && (
            <p style={{ color: "var(--color-gray)" }}>No products matched yet.</p>
          )}

          {recommendations?.recommendations?.map((rec) => (
            <div
              key={rec.id}
              style={{
                borderLeft: `4px solid ${CATEGORY_COLORS[rec.category] || "var(--color-gray)"}`,
                backgroundColor: "white",
                padding: "16px 20px",
                marginBottom: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem" }}>{rec.name}</strong>
                <span style={{ fontSize: "0.75rem", color: CATEGORY_COLORS[rec.category] || "var(--color-gray)", fontWeight: 600 }}>
                  {rec.category}
                </span>
              </div>
              <p style={{ margin: "8px 0", fontSize: "0.9rem", color: "var(--color-gray)" }}>{rec.dosage}</p>
              <hr style={{ border: "none", borderTop: "1px solid var(--color-border)", margin: "12px 0" }} />
              <p style={{ margin: 0, fontSize: "0.85rem" }}>
                Matched: {rec.matched_goals.map((g) => g.replace(/_/g, " ")).join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;