// src/pages/LoginPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

export default function LoginPage() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Call real backend — returns { success, token, user: { id, name, email } }
      const response = await authAPI.login(form);

      // Persist JWT so the Axios interceptor attaches it to every request
      localStorage.setItem("token", response.token);

      // Store user in context — note backend returns `id`, not `_id`
      // We normalize to _id here so the rest of the app works consistently
      login({
        _id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        createdAt: response.user.createdAt,
      });

      navigate("/dashboard");

    } catch (err) {
      setError(
        err?.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        color: "white",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          background: "#0f172a",
          padding: "40px",
          borderRadius: "20px",
          border: "1px solid #1e293b",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <h1 style={{ fontSize: "36px", marginBottom: "10px" }}>
            AdvisorAI
          </h1>

          <p style={{ color: "#94a3b8" }}>
            Sign in to continue
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "#f87171",
              padding: "12px 16px",
              borderRadius: "10px",
              marginBottom: "20px",
              fontSize: "14px",
            }}
          >
            ⚠ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: "20px" }}>
            <label>Email</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@startup.com"
              required
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}>
            <label>Password</label>

            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "14px",
                marginTop: "8px",
                borderRadius: "10px",
                border: "none",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: loading ? "#1d4ed8" : "#2563eb",
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: "16px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "#94a3b8",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
            }}
          >
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}