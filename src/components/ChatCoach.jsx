// ChatCoach.jsx
// Lets the member ask their AI coach follow-up questions. Conversation
// history lives only in this component's state — it resets on page
// refresh by design (no persistence yet, keeps this phase simple).
import { useState, useRef, useEffect } from "react";
import apiClient from "../api/client";

function ChatCoach({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  // Keeps the chat scrolled to the latest message as new ones arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setSending(true);
    setError("");

    try {
      const response = await apiClient.post(`/chat/${userId}`, {
        message: userMessage.content,
        history: messages, // history BEFORE this new message, matches backend expectation
      });
      setMessages([...updatedMessages, { role: "assistant", content: response.data.reply }]);
    } catch (err) {
      setError("Your coach couldn't respond just now. Try again in a moment.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      style={{
        backgroundColor: "white",
        borderLeft: "4px solid var(--color-blue)",
        padding: "20px",
        marginBottom: "32px",
      }}
    >
      <p style={{ fontSize: "0.85rem", color: "var(--color-blue)", fontWeight: 600, margin: "0 0 12px 0" }}>
        Ask Your Coach
      </p>

      <div
        style={{
          maxHeight: "280px",
          overflowY: "auto",
          marginBottom: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {messages.length === 0 && (
          <p style={{ color: "var(--color-gray)", fontSize: "0.9rem", margin: 0 }}>
            Ask anything about your recommendations, diet, or routine.
          </p>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              backgroundColor: msg.role === "user" ? "var(--color-navy)" : "var(--color-bg)",
              color: msg.role === "user" ? "white" : "var(--color-navy)",
              padding: "10px 14px",
              fontSize: "0.9rem",
              lineHeight: 1.5,
            }}
          >
            {msg.content}
          </div>
        ))}

        {sending && (
          <div
            style={{
              alignSelf: "flex-start",
              color: "var(--color-gray)",
              fontSize: "0.85rem",
              fontStyle: "italic",
            }}
          >
            Coach is typing...
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && (
        <p style={{ color: "var(--color-error)", fontSize: "0.85rem", marginBottom: "8px" }}>
          {error}
        </p>
      )}

      <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          disabled={sending}
          style={{ flex: 1 }}
        />
        <button type="submit" disabled={sending || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatCoach;