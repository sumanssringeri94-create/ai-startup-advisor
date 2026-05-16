// src/pages/LandingPage.js

import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const FEATURES = [
  { icon: "◈", label: "AI Strategy",    desc: "Get personalised startup strategies powered by GPT-level intelligence." },
  { icon: "∿", label: "Market Insights", desc: "Real-time analysis of your domain, audience, and competitive landscape." },
  { icon: "◎", label: "Goal Tracking",   desc: "Set milestones, track progress, and stay on course with smart nudges." },
  { icon: "⊞", label: "Smart Dashboard", desc: "One unified view of your startup health, metrics, and AI recommendations." },
];

const LOGOS = ["Y Combinator", "Sequoia", "a16z", "Techstars", "500 Startups"];

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
  }, [isAuthenticated, navigate]);

  // Parallax subtle effect on hero
    // Keep hero text fixed
  useEffect(() => {
    if (heroRef.current) {
      heroRef.current.style.transform = "translateY(0px)";
    }
  }, []);

  return (
    <div className="min-h-screen bg-obsidian-950 overflow-x-hidden">
      {/* ── Background grid + glow ── */}
      <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
      <div className="fixed inset-0 bg-hero-glow pointer-events-none" />

      {/* ── Navbar ── */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/[0.05]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-volt-400 rounded-lg flex items-center justify-center">
            <span className="text-obsidian-950 font-display font-700 text-sm">A</span>
          </div>
          <span className="font-display font-700 text-white text-base tracking-tight">AdvisorAI</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/login")} className="btn-ghost text-sm py-2">
            Log in
          </button>
          <button onClick={() => navigate("/signup")} className="btn-volt text-sm py-2">
            Get started →
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20">
        {/* Badge */}
        <div className="tag-volt mb-8 animate-fade-in">
          <span className="w-1.5 h-1.5 rounded-full bg-volt-400 animate-pulse-slow" />
          AI-Powered · Hackathon Ready · Production Grade
        </div>

        {/* Headline */}
        <h1
          ref={heroRef}
          className="font-display font-800 text-5xl md:text-7xl leading-[1.05] tracking-tight text-white max-w-4xl animate-fade-up opacity-0-init"
          style={{ animationFillMode: "forwards" }}
        >
          Your AI co-founder
          <br />
          <span className="text-volt-400">for every stage.</span>
        </h1>

        <p className="mt-6 text-gray-400 font-body text-lg max-w-xl leading-relaxed animate-fade-up animate-delay-100 opacity-0-init" style={{ animationFillMode: "forwards" }}>
          AdvisorAI turns your startup idea into an actionable strategy.
          Chat with AI, track goals, and grow faster — all in one place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-10 animate-fade-up animate-delay-200 opacity-0-init" style={{ animationFillMode: "forwards" }}>
          <button
            onClick={() => navigate("/signup")}
            className="btn-volt px-8 py-3.5 text-base animate-glow"
          >
            Start for free →
          </button>
          <button
            onClick={() => navigate("/login")}
            className="btn-ghost px-8 py-3.5 text-base"
          >
            Sign in
          </button>
        </div>

        {/* Social proof strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 animate-fade-up animate-delay-300 opacity-0-init" style={{ animationFillMode: "forwards" }}>
          <p className="section-label">Trusted by founders from</p>
          {LOGOS.map((l) => (
            <span key={l} className="text-gray-600 font-display font-600 text-sm hover:text-gray-400 transition-colors">
              {l}
            </span>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <p className="section-label text-center mb-4">What you get</p>
        <h2 className="font-display font-700 text-3xl md:text-4xl text-white text-center mb-12">
          Everything a founder needs
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={f.label}
              className="glow-card p-6 group hover:border-volt-400/20 transition-all duration-300"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-volt-400/10 border border-volt-400/20 flex items-center justify-center mb-4 group-hover:bg-volt-400/20 transition-colors">
                <span className="text-volt-400 text-lg">{f.icon}</span>
              </div>
              <h3 className="font-display font-700 text-white text-base mb-2">{f.label}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 pb-24">
        <div className="glass-card p-10 text-center border-volt-400/10 bg-gradient-to-br from-volt-400/5 to-transparent">
          <h2 className="font-display font-800 text-3xl text-white mb-3">
            Ready to build smarter?
          </h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Join thousands of founders who use AdvisorAI to validate ideas, plan strategy, and move fast.
          </p>
          <button onClick={() => navigate("/signup")} className="btn-volt px-10 py-3.5">
            Create your account →
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-white/[0.05] px-6 py-6 flex items-center justify-between">
        <span className="font-display font-700 text-gray-600 text-sm">AdvisorAI</span>
        <span className="text-gray-700 text-xs font-mono">Built for hackathons · Powered by AI</span>
      </footer>
    </div>
  );
}
