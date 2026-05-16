import React from "react";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {

  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#020617",
        color: "white",
        padding: "40px",
        fontFamily: "Arial",
      }}
    >

      <h1 style={{ fontSize: "64px", marginBottom: "10px" }}>
        Dashboard 🚀
      </h1>

      <p
        style={{
          color: "#94a3b8",
          marginBottom: "50px",
          fontSize: "20px",
        }}
      >
        Welcome to AI Startup Advisor
      </p>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
          gap: "25px",
        }}
      >

        {/* Startup */}
        <div style={cardStyle}>
          <h2>Startup Profile</h2>

          <p>Create and manage your startup.</p>

          <button
            style={btnStyle}
            onClick={() => navigate("/startup")}
          >
            Open
          </button>
        </div>

        {/* Chat */}
        <div style={cardStyle}>
          <h2>AI Chat</h2>

          <p>Talk with your AI startup advisor.</p>

          <button
            style={btnStyle}
            onClick={() => navigate("/chat")}
          >
            Chat Now
          </button>
        </div>

        {/* Analytics */}
        <div style={cardStyle}>
          <h2>Analytics</h2>

          <p>Track startup growth and goals.</p>

          <button
            style={btnStyle}
            onClick={() => navigate("/analytics")}
          >
            View
          </button>
        </div>

      </div>

    </div>
  );
}

const cardStyle = {
  background: "#1e293b",
  padding: "30px",
  borderRadius: "20px",
};

const btnStyle = {
  marginTop: "20px",
  padding: "12px 20px",
  background: "#2563eb",
  border: "none",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
};