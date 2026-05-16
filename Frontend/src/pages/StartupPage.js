// src/pages/StartupPage.js

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { startupAPI } from "../services/api";
import AppLayout from "../components/AppLayout";

const DOMAINS = [
  "SaaS",
  "EdTech",
  "HealthTech",
  "FinTech",
  "E-Commerce",
  "AI/ML",
  "Web3",
  "CleanTech",
  "AgriTech",
  "Other",
];

export default function StartupPage() {
  const { user } = useAuth();

  const [startup, setStartup] = useState(null);
  const [startupId, setStartupId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [goalInput, setGoalInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    startupName: "",
    domain: "",
    targetAudience: "",
    budget: "",
    goals: [],
  });

  /* =========================
     LOAD STARTUP
  ========================= */
  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const userId = user?._id || user?.id;
        if (!userId) return;

        const res = await startupAPI.get(userId);
        const s = res?.startup;

        if (s) {
          setStartup(s);
          setStartupId(s._id);
          setForm({
            startupName: s.startupName || "",
            domain: s.domain || "",
            targetAudience: s.targetAudience || "",
            budget: s.budget || "",
            goals: s.goals || [],
          });
        } else {
          setIsEditing(true);
        }
      } catch (err) {
        console.log("No startup profile yet");
        setIsEditing(true);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* =========================
     ADD GOAL
  ========================= */
  const addGoal = () => {
    if (goalInput.trim() && form.goals.length < 8) {
      setForm({ ...form, goals: [...form.goals, goalInput.trim()] });
      setGoalInput("");
    }
  };

  /* =========================
     REMOVE GOAL
  ========================= */
  const removeGoal = (i) => {
    setForm({ ...form, goals: form.goals.filter((_, idx) => idx !== i) });
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const userId = user?._id || user?.id;
      const payload = { ...form, userId, budget: Number(form.budget) || 0 };

      if (startup) {
        const updated = await startupAPI.update(startupId, payload);
        setStartup(updated?.startup);
        setSuccess("Startup profile updated successfully!");
      } else {
        const created = await startupAPI.create(payload);
        const newStartup = created?.startup;
        setStartup(newStartup);
        setStartupId(newStartup?._id);
        setSuccess("Startup profile created successfully!");
      }

      setIsEditing(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to save startup profile.");
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     INPUT STYLE
  ========================= */
  const inputCls =
    "w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors";

  /* =========================
     RENDER
  ========================= */
  if (loading) {
    return (
      <AppLayout title="Startup Profile" subtitle="Define your startup — the AI uses this to personalise advice.">
        <div className="flex justify-center items-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title="Startup Profile"
      subtitle="Define your startup — the AI uses this to personalise advice."
    >
      <div className="max-w-3xl space-y-6">

        {/* ── SUCCESS BANNER ── */}
        {success && (
          <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-5 py-4 rounded-2xl text-sm">
            <span>✓</span>
            {success}
          </div>
        )}

        {/* ── ERROR BANNER ── */}
        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 px-5 py-4 rounded-2xl text-sm">
            <span>⚠</span>
            {error}
          </div>
        )}

        {/* ════════════════════════════════
            PROFILE VIEW MODE
        ════════════════════════════════ */}
        {!isEditing && startup && (
          <div className="space-y-4">

            {/* Header card */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 text-2xl font-bold">
                    {startup.startupName?.[0]?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <h2 className="text-white text-xl font-bold">{startup.startupName}</h2>
                    <span className="inline-block mt-1 text-xs bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full">
                      {startup.domain}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors"
                >
                  ✎ Edit
                </button>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Target Audience</p>
                <p className="text-white text-sm">{startup.targetAudience || "—"}</p>
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5">
                <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">Monthly Budget</p>
                <p className="text-white text-sm">
                  {startup.budget ? `$${Number(startup.budget).toLocaleString()}` : "—"}
                </p>
              </div>
            </div>

            {/* Goals */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">
                  ⊞
                </div>
                <h3 className="text-white font-semibold">Goals & Milestones</h3>
              </div>

              {startup.goals?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {startup.goals.map((g, i) => (
                    <span
                      key={i}
                      className="bg-gray-900 border border-gray-600 text-gray-300 text-sm px-4 py-2 rounded-xl"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-sm">No goals added yet.</p>
              )}
            </div>

            {/* Last updated */}
            <p className="text-xs text-gray-600 px-1">
              Last updated:{" "}
              {startup.updatedAt
                ? new Date(startup.updatedAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "—"}
            </p>

          </div>
        )}

        {/* ════════════════════════════════
            EDIT / CREATE FORM MODE
        ════════════════════════════════ */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* BASIC INFO */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">

              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm">
                    ◎
                  </div>
                  <h2 className="text-white font-semibold text-lg">Basic Info</h2>
                </div>

                {/* Cancel — only if a profile already exists */}
                {startup && (
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setError(""); }}
                    className="text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-4 py-2 rounded-xl transition-colors"
                  >
                    ✕ Cancel
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
                    Startup Name *
                  </label>
                  <input
                    type="text"
                    name="startupName"
                    value={form.startupName}
                    onChange={handleChange}
                    placeholder="e.g. EduAI Labs"
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
                    Domain / Industry *
                  </label>
                  <select
                    name="domain"
                    value={form.domain}
                    onChange={handleChange}
                    required
                    className={inputCls}
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">Select a domain...</option>
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
                    Target Audience *
                  </label>
                  <input
                    type="text"
                    name="targetAudience"
                    value={form.targetAudience}
                    onChange={handleChange}
                    placeholder="e.g. College students"
                    required
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
                    Monthly Budget (USD)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="5000"
                    min="0"
                    className={inputCls}
                  />
                </div>

              </div>
            </div>

            {/* GOALS */}
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6">

              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 text-sm">
                  ⊞
                </div>
                <h2 className="text-white font-semibold text-lg">Goals & Milestones</h2>
              </div>

              <p className="text-gray-500 text-sm mb-5">Add startup goals for AI guidance.</p>

              <div className="flex gap-3 mb-5">
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") { e.preventDefault(); addGoal(); }
                  }}
                  placeholder='e.g. "Launch MVP in 3 months"'
                  className={`${inputCls} flex-1`}
                />
                <button
                  type="button"
                  onClick={addGoal}
                  disabled={!goalInput.trim() || form.goals.length >= 8}
                  className="bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors"
                >
                  + Add
                </button>
              </div>

              {form.goals.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.goals.map((g, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 bg-gray-900 border border-gray-600 text-gray-300 text-sm px-4 py-2 rounded-xl"
                    >
                      <span>{g}</span>
                      <button type="button" onClick={() => removeGoal(i)} className="text-red-400">×</button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="border border-dashed border-gray-700 rounded-xl py-6 text-center">
                  <p className="text-gray-600 text-sm">No goals added yet.</p>
                </div>
              )}

            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : startup ? (
                "Update Startup Profile →"
              ) : (
                "Create Startup Profile →"
              )}
            </button>

          </form>
        )}

      </div>
    </AppLayout>
  );
}