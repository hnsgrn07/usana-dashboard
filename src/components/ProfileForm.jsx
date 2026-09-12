// ProfileForm.jsx
import { useState } from "react";
import apiClient from "../api/client";
import { GOAL_ICONS } from "../utils/goalIcons";

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
        user_id: "placeholder",
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
      <div className="panel-accent" style={{ marginBottom: "var(--space-5)" }}>
        <p className="eyebrow">{initialData ? "Update your info" : "First-time setup"}</p>
        <h2>{initialData ? "Edit your health profile" : "Set up your health profile"}</h2>
      </div>

      <div className="field">
        <label>Full Name</label>
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>

      <div className="field">
        <label>Age</label>
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
      </div>

      <div className="field">
        <label>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div style={{ display: "flex", gap: "var(--space-4)" }}>
        <div className="field" style={{ flex: 1 }}>
          <label>Weight (kg)</label>
          <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
        </div>
        <div className="field" style={{ flex: 1 }}>
          <label>Height (cm)</label>
          <input type="number" step="0.1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} required />
        </div>
      </div>

      <div className="field">
        <label>Activity Level</label>
        <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>

      <div className="field">
        <label>Health Goals (pick at least one)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
          {HEALTH_GOALS.map((goal) => {
            const checked = healthGoals.includes(goal);
            const Icon = GOAL_ICONS[goal];
            return (
              <label
                key={goal}
                onClick={() => toggleGoal(goal)}
                className={`chip ${checked ? "selected" : ""}`}
              >
                <Icon size={14} />
                {goal.replace(/_/g, " ")}
              </label>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label>Dietary Restrictions</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
          {DIETARY_RESTRICTIONS.map((restriction) => {
            const checked = dietaryRestrictions.includes(restriction);
            return (
              <label
                key={restriction}
                onClick={() => toggleRestriction(restriction)}
                className={`chip ${checked ? "selected" : ""}`}
              >
                {restriction.replace(/_/g, " ")}
              </label>
            );
          })}
        </div>
      </div>

      <div className="field">
        <label>Notes</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      </div>

      {error && <p style={{ color: "var(--color-error)", fontSize: "var(--text-sm)" }}>{error}</p>}
      <button type="submit" className="btn btn-full">
        {initialData ? "Save Changes" : "Save Profile"}
      </button>
    </form>
  );
}

export default ProfileForm;