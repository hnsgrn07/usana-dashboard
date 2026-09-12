// ProgressChart.jsx
// Shows a member's weight trend over time, pulled from their
// saved profile snapshots (one point per day they updated their profile)
import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import apiClient from "../api/client";

function ProgressChart({ userId }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    apiClient.get(`/progress/${userId}`)
      .then((response) => setData(response.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return null;

  // Not enough history yet to draw a meaningful trend
  if (data.length < 2) {
    return (
      <div
        style={{
          backgroundColor: "white",
          borderLeft: "4px solid var(--color-lightblue)",
          padding: "20px",
          marginBottom: "32px",
        }}
      >
        <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 8px 0" }}>
          Progress
        </p>
        <p style={{ margin: 0, color: "var(--color-gray)" }}>
          Keep updating your profile over time to see your progress trend here.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        borderLeft: "4px solid var(--color-lightblue)",
        padding: "20px",
        marginBottom: "32px",
      }}
    >
      <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 16px 0" }}>
        Weight Progress
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="var(--color-border)" strokeDasharray="0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "var(--color-navy)" }}
            tickFormatter={(d) => d.slice(5)} // shows MM-DD instead of full date
          />
          <YAxis
            tick={{ fontSize: 12, fill: "var(--color-navy)" }}
            domain={["auto", "auto"]}
            unit="kg"
          />
          <Tooltip
            contentStyle={{ borderRadius: 0, border: "1px solid var(--color-border)", fontFamily: "var(--font-body)" }}
          />
          <Line
            type="monotone"
            dataKey="weight_kg"
            stroke="var(--color-navy)"
            strokeWidth={2}
            dot={{ fill: "var(--color-navy)", r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ProgressChart;