// src/pages/DashboardPage.js

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { startupAPI, chatAPI } from "../services/api";
import AppLayout from "../components/AppLayout";

// ── Stat card ────────────────────────────────────────────────────────────────
const StatCard = ({ label, value, sub, accent, icon, delay = 0 }) => (
  <div
    className="glow-card p-5 animate-fade-up opacity-0-init hover:border-white/10 transition-all duration-300"
    style={{ animationDelay: `${delay}s`, animationFillMode: "forwards" }}
  >
    <div className="flex items-start justify-between mb-3">
      <span className="section-label">{label}</span>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${accent}`}>
        {icon}
      </div>
    </div>
    <p className="font-display font-700 text-2xl text-white">{value}</p>
    {sub && <p className="text-xs text-gray-600 mt-1">{sub}</p>}
  </div>
);

// ── Activity item ─────────────────────────────────────────────────────────────
const ActivityItem = ({ text, time, color }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${color}`} />
    <p className="text-sm text-gray-400 flex-1">{text}</p>
    <span className="text-xs text-gray-600 font-mono flex-shrink-0">{time}</span>
  </div>
);

// ── AI Tip card ───────────────────────────────────────────────────────────────
const TIPS = [
  "Validate your idea with 20 customer interviews before writing any code.",
  "Build in public — tweet your progress weekly to attract early adopters.",
  "Your first 100 users should come from direct outreach, not ads.",
  "Focus on one metric: weekly active users. Everything else is noise.",
  "Revenue solves everything — charge early, even if it's uncomfortable.",
];

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [startup,    setStartup]    = useState(null);
  const [chatCount,  setChatCount]  = useState(0);
  const [tip,        setTip]        = useState(TIPS[0]);
  const [loading,    setLoading]    = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch startup profile
        const sRes = await startupAPI.get(user.id);
        setStartup(sRes.data.startup);
      } catch {
        // User hasn't created a startup yet — that's fine
      }

      try {
        // Fetch chat history count
        const cRes = await chatAPI.getHistory(user.id);
        setChatCount(cRes.data.totalMessages || 0);
      } catch {
        // No chats yet
      }

      // Rotate tip daily
      const dayIndex = new Date().getDate() % TIPS.length;
      setTip(TIPS[dayIndex]);

      setLoading(false);
    };

    fetchData();
  }, [user.id]);

  const stats = [
    {
      label: "Startup Stage",
      value: startup ? "Active" : "Not Set",
      sub: startup ? startup.startupName : "Create your profile",
      icon: "◎",
      accent: "bg-volt-400/10 text-volt-400",
    },
    {
      label: "AI Conversations",
      value: Math.floor(chatCount / 2) || 0,
      sub: "Total sessions with AI",
      icon: "◈",
      accent: "bg-aurora-blue/10 text-aurora-blue",
    },
    {
      label: "Goals Set",
      value: startup?.goals?.length || 0,
      sub: "Milestones defined",
      icon: "⊞",
      accent: "bg-aurora-purple/10 text-aurora-purple",
    },
    {
      label: "Budget",
      value: startup?.budget ? `$${startup.budget.toLocaleString()}` : "—",
      sub: startup?.domain || "No startup yet",
      icon: "∿",
      accent: "bg-aurora-teal/10 text-aurora-teal",
    },
  ];

  const activities = [
    { text: "Account created successfully",       time: "Today",       color: "bg-volt-400" },
    { text: "Backend API connected",              time: "Today",       color: "bg-aurora-teal" },
    { text: startup ? `Startup "${startup.startupName}" saved` : "No startup profile yet", time: startup ? "Recent" : "—", color: startup ? "bg-aurora-blue" : "bg-gray-600" },
    { text: `${Math.floor(chatCount / 2)} AI chat sessions completed`, time: "All time", color: "bg-aurora-purple" },
  ];

  return (
    <AppLayout
      title="Dashboard"
      subtitle={`Welcome back, ${user?.name?.split(" ")[0]}! Here's your startup at a glance.`}
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-volt-400/30 border-t-volt-400 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="max-w-5xl space-y-6">

          {/* ── Stats grid ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <StatCard key={s.label} {...s} delay={i * 0.08} />
            ))}
          </div>

          {/* ── Middle row ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Recent activity */}
            <div className="lg:col-span-2 glass-card p-5 animate-fade-up opacity-0-init animate-delay-300" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-700 text-white text-sm">Recent Activity</h3>
                <span className="tag-volt">Live</span>
              </div>
              <div>
                {activities.map((a, i) => (
                  <ActivityItem key={i} {...a} />
                ))}
              </div>
            </div>

            {/* AI Tip of the day */}
            <div className="glass-card p-5 flex flex-col animate-fade-up opacity-0-init animate-delay-400" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-volt-400/10 rounded-lg flex items-center justify-center">
                  <span className="text-volt-400 text-xs">◈</span>
                </div>
                <h3 className="font-display font-700 text-white text-sm">AI Insight</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed flex-1">"{tip}"</p>
              <button
                onClick={() => navigate("/chat")}
                className="mt-4 btn-ghost w-full justify-center text-xs"
              >
                Ask the AI →
              </button>
            </div>
          </div>

          {/* ── Startup summary or CTA ── */}
          {startup ? (
            <div className="glass-card p-5 animate-fade-up opacity-0-init animate-delay-500" style={{ animationFillMode: "forwards" }}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <p className="section-label mb-1">Your Startup</p>
                  <h3 className="font-display font-700 text-white text-lg">{startup.startupName}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="tag-blue">{startup.domain}</span>
                    <span className="tag-teal">{startup.targetAudience}</span>
                  </div>
                </div>
                <button onClick={() => navigate("/startup")} className="btn-ghost text-sm">
                  Edit profile →
                </button>
              </div>

              {startup.goals?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/[0.05]">
                  <p className="section-label mb-2">Goals</p>
                  <div className="flex flex-wrap gap-2">
                    {startup.goals.map((g, i) => (
                      <span key={i} className="px-3 py-1 bg-white/[0.04] border border-white/[0.06] rounded-full text-xs text-gray-400">
                        {g}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card p-6 text-center border-dashed border-volt-400/10 animate-fade-up opacity-0-init animate-delay-500" style={{ animationFillMode: "forwards" }}>
              <p className="text-gray-600 text-sm mb-3">No startup profile yet</p>
              <button onClick={() => navigate("/startup")} className="btn-volt text-sm">
                Create startup profile →
              </button>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}
