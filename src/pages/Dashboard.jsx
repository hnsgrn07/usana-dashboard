// Shows the logged-in user's profile and recommendations,
// or a setup form if they haven't created a profile yet
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/client";
import { clearToken } from "../auth";
import ProfileForm from "../components/ProfileForm";

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
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

  function handleProfileSaved(savedProfile) {
    setProfile(savedProfile);
    loadRecommendations(userId);
  }

  function handleLogout() {
    clearToken();
    navigate("/login");
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>My Dashboard</h1>
        <button onClick={handleLogout}>Log Out</button>
      </div>

      {!profile && <ProfileForm onSaved={handleProfileSaved} />}

      {profile && (
        <div>
          <h2>Hi, {profile.full_name}</h2>
          <p>Age: {profile.age} | Activity: {profile.activity_level.replace(/_/g, " ")}</p>
          <p>Goals: {profile.health_goals.map((g) => g.replace(/_/g, " ")).join(", ")}</p>

          <h3>Your Recommendations</h3>
          {recommendations?.status === "no_matches" && <p>No products matched yet.</p>}
          {recommendations?.recommendations?.map((rec) => (
            <div key={rec.id} style={{ border: "1px solid #ccc", padding: "12px", marginBottom: "8px" }}>
              <strong>{rec.name}</strong> ({rec.category})
              <p>{rec.dosage}</p>
              <p>Matched goals: {rec.matched_goals.map((g) => g.replace(/_/g, " ")).join(", ")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;