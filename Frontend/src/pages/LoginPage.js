// src/pages/LoginPage.js

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form,    setForm]    = useState({ email: "", password: "" });
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await authAPI.login(form);
      const { token, user } = res.data;

      login(user, token);          // save to context + localStorage
      navigate("/dashboard");      // redirect to app
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 flex items-center justify-center px-4">
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-hero-glow pointer-events-none" />

      <div className="relative z-10 w-full max-w-md animate-fade-up opacity-0-init" style={{ animationFillMode: "forwards" }}>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-volt-400 rounded-xl flex items-center justify-center">
            <span className="text-obsidian-950 font-display font-700">A</span>
          </div>
          <span className="font-display font-700 text-white text-lg">AdvisorAI</span>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <h2 className="font-display font-700 text-2xl text-white mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue.</p>

          {/* Error message */}
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-aurora-pink/10 border border-aurora-pink/20 text-aurora-pink text-sm animate-fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                placeholder="••••••••"
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
                  Signing in...
                </>
              ) : (
                "Sign in →"
              )}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-volt-400 hover:text-volt-500 font-500 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>

        <p className="text-center text-gray-700 text-xs mt-6 font-mono">
          Your data is encrypted and secure.
        </p>
      </div>
    </div>
  );
}
