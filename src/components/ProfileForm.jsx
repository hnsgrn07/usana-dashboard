// ProfileForm.jsx
// Lets someone fill out their health profile — used both for first-time
// setup (no initialData) and editing an existing profile (initialData passed in)
import { useState } from "react";
import apiClient from "../api/client";

const HEALTH_GOALS = [
  "energy_support", "immune_support", "joint_support", "digestive_health",
  "heart_health", "weight_management", "stress_management", "sleep_quality",
  "skin_health", "cognitive_support", "general_wellness", "eye_health",
  "bone_health", "detox_support", "mens_health"
];

const DIETARY_RESTRICTIONS = [
  "vegetarian", "vegan", "gluten_free", "dairy_free", "nut_allergy", "none"
];

function ProfileForm({ onSaved, initialData }) {
  const [fullName, setFullName] = useState(initialData?.full_name || "");
  const [age, setAge] = useState(initialData?.age || "");
  const [gender, setGender] = useState(initialData?.gender || "prefer_not_to_say");
  const [weightKg, setWeightKg] = useState(initialData?.weight_kg || "");
  const [heightCm, setHeightCm] = useState(initialData?.height_cm || "");
  const [activityLevel, setActivityLevel] = useState(initialData?.activity_level || "moderate");
  const [healthGoals, setHealthGoals] = useState(initialData?.health_goals || []);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(initialData?.dietary_restrictions || []);
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [error, setError] = useState("");

  function toggleGoal(goal) {
    setHealthGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  }

  function toggleRestriction(restriction) {
    setDietaryRestrictions((prev) =>
      prev.includes(restriction)
        ? prev.filter((r) => r !== restriction)
        : [...prev, restriction]
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await apiClient.post("/profile", {
        user_id: "placeholder", // backend replaces this with the real logged-in user id
        full_name: fullName,
        age: parseInt(age),
        gender,
        weight_kg: parseFloat(weightKg),
        height_cm: parseFloat(heightCm),
        activity_level: activityLevel,
        health_goals: healthGoals,
        dietary_restrictions: dietaryRestrictions,
        notes: notes || null,
      });

      onSaved(response.data.data);
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(typeof detail === "string" ? detail : "Please check your entries and try again");
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "0 auto" }}>
      <div style={{ borderLeft: "4px solid var(--color-blue)", paddingLeft: "20px", marginBottom: "24px" }}>
        <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 4px 0" }}>
          {initialData ? "Update your info" : "First-time setup"}
        </p>
        <h2 style={{ fontSize: "1.75rem", margin: 0 }}>
          {initialData ? "Edit your health profile" : "Set up your health profile"}
        </h2>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Full Name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Age</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "16px", marginBottom: "16px" }}>
        <div style={{ flex: 1 }}>
          <label>Weight (kg)</label>
          <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
        </div>
        <div style={{ flex: 1 }}>
          <label>Height (cm)</label>
          <input type="number" step="0.1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} required />
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label>Activity Level</label>
        <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label>Health Goals (pick at least one)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
          {HEALTH_GOALS.map((goal) => {
            const checked = healthGoals.includes(goal);
            return (
              <label
                key={goal}
                onClick={() => toggleGoal(goal)}
                style={{
                  fontSize: "0.85rem",
                  padding: "6px 12px",
                  border: `1px solid ${checked ? "var(--color-navy)" : "var(--color-border)"}`,
                  backgroundColor: checked ? "var(--color-navy)" : "white",
                  color: checked ? "white" : "var(--color-navy)",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {goal.replace(/_/g, " ")}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label>Dietary Restrictions</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "8px" }}>
          {DIETARY_RESTRICTIONS.map((restriction) => {
            const checked = dietaryRestrictions.includes(restriction);
            return (
              <label
                key={restriction}
                onClick={() => toggleRestriction(restriction)}
                style={{
                  fontSize: "0.85rem",
                  padding: "6px 12px",
                  border: `1px solid ${checked ? "var(--color-blue)" : "var(--color-border)"}`,
                  backgroundColor: checked ? "var(--color-blue)" : "white",
                  color: checked ? "white" : "var(--color-navy)",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {restriction.replace(/_/g, " ")}
              </label>
            );
          })}
        </div>
      </div>

      <div style={{ marginBottom: "24px" }}>
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </div>

      {error && (
        <p style={{ color: "var(--color-error)", fontSize: "0.9rem", marginBottom: "16px" }}>
          {error}
        </p>
      )}
      <button type="submit" style={{ width: "100%" }}>
        {initialData ? "Save Changes" : "Save Profile"}
      </button>
    </form>
  );
}

export default ProfileForm;