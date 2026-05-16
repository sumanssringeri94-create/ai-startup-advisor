// src/pages/SignupPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await authAPI.signup(form);
      console.log("✅ signup res:", res);
      const { token, user } = res;
      console.log("token:", token, "user:", user);

      // Persist JWT so Axios interceptor attaches it to every request
      localStorage.setItem("token", token);

      // Normalize id to _id so the rest of the app works consistently
      login({
        _id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      });

      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-grid-pattern bg-grid pointer-events-none" />
      <div className="fixed inset-0 bg-hero-glow pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fade-up opacity-0-init" style={{ animationFillMode: "forwards" }}>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-volt-400 rounded-xl flex items-center justify-center">
            <span className="text-obsidian-950 font-display font-700">A</span>
          </div>
          <span className="font-display font-700 text-white text-lg">AdvisorAI</span>
        </div>

        <div className="glass-card p-8">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-display font-700 text-2xl text-white">Create account</h2>
            <span className="tag-volt text-xs">Free</span>
          </div>
          <p className="text-gray-500 text-sm mb-8">Start building your AI-powered startup today.</p>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-aurora-pink/10 border border-aurora-pink/20 text-aurora-pink text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 font-mono mb-1.5 uppercase tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Arjun Sharma"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-mono mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@startup.com"
                required
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 font-mono mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                required
                className="input-field"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-volt w-full justify-center mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account →"
              )}
            </button>
          </form>

          {/* Perks list */}
          <div className="mt-6 pt-6 border-t border-white/[0.05] space-y-2">
            {["Free forever — no credit card", "AI advisor ready instantly", "Secure JWT authentication"].map((p) => (
              <div key={p} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-volt-400">✓</span>
                {p}
              </div>
            ))}
          </div>

          <p className="text-center text-gray-600 text-sm mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-volt-400 hover:text-volt-500 font-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}