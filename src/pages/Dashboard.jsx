// Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { clearToken } from "../auth";
import ProfileForm from "../components/ProfileForm";
import HabitTracker from "../components/HabitTracker";
import ProgressChart from "../components/ProgressChart";
import ChatCoach from "../components/ChatCoach";
import { GOAL_ICONS } from "../utils/goalIcons";

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

  useEffect(() => {
    apiClient.get("/me")
      .then((response) => setUserId(response.data.user_id))
      .catch(() => {
        clearToken();
        navigate("/login");
      });
  }, [navigate]);

  useEffect(() => {
    if (!userId) return;

    apiClient.get(`/profile/${userId}`)
      .then((response) => {
        setProfile(response.data);
        loadRecommendations(userId);
        loadCoaching(userId);
      })
      .catch((err) => {
        if (err.response?.status === 404) setProfile(null);
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

  if (loading) return <p style={{ textAlign: "center", marginTop: "var(--space-8)" }}>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "var(--space-7) var(--space-5) var(--space-5)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "var(--space-6)" }}>
        <h1 style={{ margin: 0 }}>My Dashboard</h1>
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          {profile && !editing && (
            <button onClick={() => setEditing(true)} className="btn-ghost">Edit Profile</button>
          )}
          <button onClick={handleLogout} className="btn-ghost">Log Out</button>
        </div>
      </div>

      {(!profile || editing) && (
        <ProfileForm onSaved={handleProfileSaved} initialData={editing ? profile : null} />
      )}

      {profile && !editing && (
        <div>
          <div className="panel-accent" style={{ marginBottom: "var(--space-6)" }}>
            <p className="eyebrow">Member profile</p>
            <h2>Hi, {profile.full_name}</h2>
            <p style={{ color: "var(--color-gray)", marginBottom: "var(--space-2)" }}>
              Age {profile.age} · {profile.activity_level.replace(/_/g, " ")} activity
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {profile.health_goals.map((g) => {
                const Icon = GOAL_ICONS[g];
                return (
                  <span key={g} className="chip selected">
                    <Icon size={14} />
                    {g.replace(/_/g, " ")}
                  </span>
                );
              })}
            </div>
          </div>

          <HabitTracker />
          <ProgressChart userId={userId} />

          {coaching && (
            <div className="panel panel-accent blue">
              <p className="eyebrow">Your Personal Coach</p>
              <p style={{ whiteSpace: "pre-line", lineHeight: 1.6, marginBottom: 0 }}>{coaching}</p>
            </div>
          )}

          <ChatCoach userId={userId} />

          <h3 style={{ marginBottom: "var(--space-4)" }}>Your Recommendations</h3>

          {recommendations?.status === "no_matches" && (
            <p style={{ color: "var(--color-gray)" }}>No products matched yet.</p>
          )}

          {recommendations?.recommendations?.map((rec) => (
            <div
              key={rec.id}
              className="panel"
              style={{ borderLeft: `4px solid ${CATEGORY_COLORS[rec.category] || "var(--color-gray)"}`, marginBottom: "var(--space-3)" }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <strong style={{ fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)" }}>{rec.name}</strong>
                <span style={{ fontSize: "var(--text-xs)", color: CATEGORY_COLORS[rec.category] || "var(--color-gray)", fontWeight: 600 }}>
                  {rec.category}
                </span>
              </div>
              <p style={{ fontSize: "var(--text-sm)", color: "var(--color-gray)" }}>{rec.dosage}</p>
              <hr className="divider" />
              <p style={{ fontSize: "var(--text-sm)", marginBottom: 0 }}>
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