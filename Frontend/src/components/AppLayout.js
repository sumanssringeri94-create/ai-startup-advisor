import Sidebar from "./Sidebar";

export default function AppLayout({
  children,
  title,
  subtitle,
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#070710",
        color: "white",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        style={{
          marginLeft: "260px",
          width: "100%",
          padding: "40px",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "40px",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "56px",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              {title}
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "18px",
              }}
            >
              {subtitle}
            </p>
          </div>

          <div style={{ textAlign: "right" }}>
            <p style={{ color: "#64748b" }}>
              Good evening,
            </p>

            <h2
              style={{
                marginTop: "6px",
                fontSize: "28px",
              }}
            >
              Founder
            </h2>
          </div>
        </div>

        {/* Page Content */}
        {children}
      </div>
    </div>
  );
}