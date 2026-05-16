// src/pages/StartupPage.js

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { startupAPI } from "../services/api";
import AppLayout from "../components/AppLayout";

const DOMAINS = ["SaaS", "EdTech", "HealthTech", "FinTech", "E-Commerce", "AI/ML", "Web3", "CleanTech", "AgriTech", "Other"];

export default function StartupPage() {
  const { user } = useAuth();

  const [startup,   setStartup]   = useState(null);
  const [startupId, setStartupId] = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [success,   setSuccess]   = useState("");
  const [error,     setError]     = useState("");
  const [goalInput, setGoalInput] = useState("");

  const [form, setForm] = useState({
    startupName: "", domain: "", targetAudience: "", budget: "", goals: [],
  });

  // Load existing startup
  useEffect(() => {
    const load = async () => {
      try {
        const res = await startupAPI.get(user.id);
        const s = res.data.startup;
        setStartup(s);
        setStartupId(s._id);
        setForm({
          startupName:    s.startupName    || "",
          domain:         s.domain         || "",
          targetAudience: s.targetAudience || "",
          budget:         s.budget         || "",
          goals:          s.goals          || [],
        });
      } catch {
        // No startup yet
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user.id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const addGoal = () => {
    if (goalInput.trim() && form.goals.length < 8) {
      setForm({ ...form, goals: [...form.goals, goalInput.trim()] });
      setGoalInput("");
    }
  };

  const removeGoal = (i) =>
    setForm({ ...form, goals: form.goals.filter((_, idx) => idx !== i) });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payload = { ...form, budget: Number(form.budget) || 0 };

    try {
      if (startup) {
        await startupAPI.update(startupId, payload);
        setSuccess("Startup profile updated successfully!");
      } else {
        const res = await startupAPI.create({ ...payload, userId: user.id });
        setStartup(res.data.startup);
        setStartupId(res.data.startup._id);
        setSuccess("Startup profile created!");
      }
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppLayout title="Startup Profile" subtitle="Define your startup details — the AI uses this to personalise advice.">
      <div className="max-w-2xl">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-7 h-7 border-2 border-volt-400/30 border-t-volt-400 rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-up opacity-0-init" style={{ animationFillMode: "forwards" }}>

            {/* Status messages */}
            {success && (
              <div className="px-4 py-3 rounded-xl bg-volt-400/10 border border-volt-400/20 text-volt-400 text-sm animate-fade-in">
                ✓ {success}
              </div>
            )}
            {error && (
              <div className="px-4 py-3 rounded-xl bg-aurora-pink/10 border border-aurora-pink/20 text-aurora-pink text-sm animate-fade-in">
                {error}
              </div>
            )}

            {/* Startup Name */}
            <div className="glass-card p-5">
              <h3 className="font-display font-700 text-white text-sm mb-4">Basic Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-1.5 uppercase tracking-wide">Startup Name</label>
                  <input
                    type="text"
                    name="startupName"
                    value={form.startupName}
                    onChange={handleChange}
                    placeholder="e.g. EduAI Labs"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-1.5 uppercase tracking-wide">Domain / Industry</label>
                  <select
                    name="domain"
                    value={form.domain}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="">Select a domain...</option>
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-1.5 uppercase tracking-wide">Target Audience</label>
                  <input
                    type="text"
                    name="targetAudience"
                    value={form.targetAudience}
                    onChange={handleChange}
                    placeholder="e.g. College students in tier-2 cities"
                    required
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 font-mono mb-1.5 uppercase tracking-wide">Monthly Budget (USD)</label>
                  <input
                    type="number"
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    placeholder="e.g. 5000"
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="glass-card p-5">
              <h3 className="font-display font-700 text-white text-sm mb-1">Goals & Milestones</h3>
              <p className="text-xs text-gray-600 mb-4">Add up to 8 goals. The AI will help you achieve them.</p>

              {/* Add goal input */}
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addGoal(); } }}
                  placeholder='e.g. "Launch MVP in 3 months"'
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={addGoal}
                  disabled={!goalInput.trim() || form.goals.length >= 8}
                  className="btn-volt text-sm px-4 py-2 disabled:opacity-40"
                >
                  Add
                </button>
              </div>

              {/* Goal chips */}
              {form.goals.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {form.goals.map((g, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-obsidian-700/60 border border-white/[0.06] rounded-xl text-sm text-gray-300"
                    >
                      <span>{g}</span>
                      <button
                        type="button"
                        onClick={() => removeGoal(i)}
                        className="text-gray-600 hover:text-aurora-pink transition-colors text-xs ml-1"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600 italic">No goals added yet.</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="btn-volt w-full justify-center py-3.5 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
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
