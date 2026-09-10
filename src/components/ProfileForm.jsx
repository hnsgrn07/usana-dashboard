// Lets someone fill out their health profile for the first time
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

function ProfileForm({ onSaved }) {
  const [fullName, setFullName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("prefer_not_to_say");
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [activityLevel, setActivityLevel] = useState("moderate");
  const [healthGoals, setHealthGoals] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [notes, setNotes] = useState("");
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
      <h2>Set Up Your Health Profile</h2>

      <div>
        <label>Full Name</label><br />
        <input value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      </div>

      <div>
        <label>Age</label><br />
        <input type="number" value={age} onChange={(e) => setAge(e.target.value)} required />
      </div>

      <div>
        <label>Gender</label><br />
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
      </div>

      <div>
        <label>Weight (kg)</label><br />
        <input type="number" step="0.1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} required />
      </div>

      <div>
        <label>Height (cm)</label><br />
        <input type="number" step="0.1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} required />
      </div>

      <div>
        <label>Activity Level</label><br />
        <select value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
      </div>

      <div>
        <label>Health Goals (pick at least one)</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {HEALTH_GOALS.map((goal) => (
            <label key={goal} style={{ fontSize: "0.9em" }}>
              <input
                type="checkbox"
                checked={healthGoals.includes(goal)}
                onChange={() => toggleGoal(goal)}
              />
              {" "}{goal.replace(/_/g, " ")}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>Dietary Restrictions</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {DIETARY_RESTRICTIONS.map((restriction) => (
            <label key={restriction} style={{ fontSize: "0.9em" }}>
              <input
                type="checkbox"
                checked={dietaryRestrictions.includes(restriction)}
                onChange={() => toggleRestriction(restriction)}
              />
              {" "}{restriction.replace(/_/g, " ")}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label>Notes</label><br />
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit">Save Profile</button>
    </form>
  );
}

export default ProfileForm;