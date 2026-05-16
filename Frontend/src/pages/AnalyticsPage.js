// src/pages/AnalyticsPage.js

import React from "react";
import AppLayout from "../components/AppLayout";

const BAR_DATA = [
  { label: "Mon", h: 40 },  { label: "Tue", h: 65 },
  { label: "Wed", h: 55 },  { label: "Thu", h: 80 },
  { label: "Fri", h: 70 },  { label: "Sat", h: 45 },
  { label: "Sun", h: 90 },
];

const METRICS = [
  { label: "AI Sessions",    value: "12",   delta: "+3 this week",  color: "text-volt-400" },
  { label: "Goals Defined",  value: "5",    delta: "2 completed",   color: "text-aurora-teal" },
  { label: "Profile Score",  value: "78%",  delta: "+12% vs last",  color: "text-aurora-blue" },
  { label: "Advice Actions", value: "8",    delta: "4 in progress", color: "text-aurora-purple" },
];

export default function AnalyticsPage() {
  const maxH = Math.max(...BAR_DATA.map((d) => d.h));

  return (
    <AppLayout title="Analytics" subtitle="Track your startup progress and AI usage metrics.">
      <div className="max-w-4xl space-y-5">

        {/* Metrics row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {METRICS.map((m, i) => (
            <div
              key={m.label}
              className="glass-card p-5 animate-fade-up opacity-0-init"
              style={{ animationDelay: `${i * 0.08}s`, animationFillMode: "forwards" }}
            >
              <p className="section-label mb-2">{m.label}</p>
              <p className={`font-display font-700 text-2xl ${m.color}`}>{m.value}</p>
              <p className="text-xs text-gray-600 mt-1">{m.delta}</p>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="glass-card p-5 animate-fade-up opacity-0-init animate-delay-300" style={{ animationFillMode: "forwards" }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-700 text-white text-sm">Weekly AI Activity</h3>
              <p className="text-xs text-gray-500 mt-0.5">Number of advisor sessions per day</p>
            </div>
            <span className="tag-volt">This week</span>
          </div>

          {/* Bar chart */}
          <div className="flex items-end gap-3 h-32">
            {BAR_DATA.map((d) => (
              <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center" style={{ height: "100%" }}>
                  <div
                    className="w-full bg-volt-400/20 rounded-t-lg border-t border-volt-400/40 hover:bg-volt-400/30 transition-all duration-300 relative group"
                    style={{ height: `${(d.h / maxH) * 100}%` }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 bg-volt-400/60 rounded-t-lg transition-all duration-700"
                      style={{ height: "30%" }}
                    />
                    {/* Tooltip */}
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:flex bg-obsidian-700 border border-white/10 rounded px-2 py-1 text-xs text-white whitespace-nowrap">
                      {d.h} sessions
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-600 font-mono">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress section */}
        <div className="glass-card p-5 animate-fade-up opacity-0-init animate-delay-400" style={{ animationFillMode: "forwards" }}>
          <h3 className="font-display font-700 text-white text-sm mb-4">Startup Progress</h3>
          {[
            { label: "Idea Validation",    pct: 85, color: "bg-volt-400" },
            { label: "MVP Development",    pct: 40, color: "bg-aurora-blue" },
            { label: "Customer Discovery", pct: 60, color: "bg-aurora-teal" },
            { label: "Fundraising Prep",   pct: 20, color: "bg-aurora-purple" },
          ].map((item) => (
            <div key={item.label} className="mb-4 last:mb-0">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-400">{item.label}</span>
                <span className="text-xs font-mono text-gray-500">{item.pct}%</span>
              </div>
              <div className="h-1.5 bg-obsidian-700 rounded-full overflow-hidden">
                <div
                  className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-700 text-xs font-mono pb-2">
          Analytics update as you use the AI advisor · Connect real data via the API
        </p>
      </div>
    </AppLayout>
  );
}