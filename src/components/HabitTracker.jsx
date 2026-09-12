// HabitTracker.jsx
// Shows the member's check-in streak and a 7-day history strip,
// with a button to check in for today
import { useEffect, useState } from "react";
import apiClient from "../api/client";

function HabitTracker() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  function loadStatus() {
    apiClient.get("/habits/status")
      .then((response) => setStatus(response.data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }

  function handleCheckIn() {
    apiClient.post("/habits/checkin")
      .then(() => loadStatus()) // refresh streak/history after checking in
      .catch(() => {});
  }

  useEffect(() => {
    loadStatus();
  }, []);

  if (loading || !status) return null;

  return (
  <div className="panel panel-accent">
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "var(--space-4)" }}>
      <div>
        <p className="eyebrow">Daily Check-In</p>
        <p style={{ margin: 0, fontFamily: "var(--font-heading)", fontSize: "var(--text-lg)" }}>
          {status.current_streak} day{status.current_streak === 1 ? "" : "s"} streak
        </p>
      </div>
      <button onClick={handleCheckIn} disabled={status.checked_in_today} className="btn">
        {status.checked_in_today ? "Checked in today" : "Check In Today"}
      </button>
    </div>
    <div style={{ display: "flex", gap: "6px" }}>
      {status.recent_days.map((day) => (
        <div
          key={day.date}
          title={day.date}
          style={{ flex: 1, height: "8px", backgroundColor: day.completed ? "var(--color-navy)" : "var(--color-border)" }}
        />
      ))}
    </div>
  </div>
);
}

export default HabitTracker;