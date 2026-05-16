import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        background: "#0f172a",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        position: "fixed",
        left: 0,
        top: 0,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1
        style={{
          fontSize: "32px",
          fontWeight: "700",
          marginBottom: "40px",
        }}
      >
        AdvisorAI
      </h1>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <NavLink to="/dashboard" className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to="/chat" className="sidebar-link">
          AI Advisor
        </NavLink>

        <NavLink to="/startup" className="sidebar-link">
          Startup
        </NavLink>

        <NavLink to="/analytics" className="sidebar-link">
          Analytics
        </NavLink>
      </div>

      <div style={{ marginTop: "auto" }}>
        <p style={{ color: "#64748b" }}>
          Founder
        </p>

        <p
          style={{
            marginTop: "8px",
            marginBottom: "20px",
          }}
        >
          kssadhan15@gmail.com
        </p>

        <button className="btn-ghost">
          Logout
        </button>
      </div>
    </div>
  );
}