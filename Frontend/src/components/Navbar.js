// src/components/Navbar.js

import React from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title = "Dashboard", subtitle = "" }) => {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-white/[0.05] bg-obsidian-900/50 backdrop-blur-xl sticky top-0 z-10">
      {/* Left: Page title */}
      <div>
        <h1 className="font-display font-700 text-white text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-gray-500 font-body">{subtitle}</p>}
      </div>

      {/* Right: Greeting + avatar */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-xs text-gray-400">{greeting},</p>
          <p className="text-sm font-display font-600 text-white">{user?.name?.split(" ")[0]}</p>
        </div>
        {/* Avatar */}
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-volt-400/30 to-aurora-purple/30 border border-volt-400/20 flex items-center justify-center">
          <span className="text-volt-400 font-display font-700 text-sm">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
