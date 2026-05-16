// src/components/Sidebar.js

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { label: "Dashboard",  icon: "⊞",  path: "/dashboard" },
  { label: "AI Advisor", icon: "◈",  path: "/chat" },
  { label: "Startup",    icon: "◎",  path: "/startup" },
  { label: "Analytics",  icon: "∿",  path: "/analytics" },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className={`
        flex flex-col h-screen sticky top-0
        bg-obsidian-900 border-r border-white/[0.05]
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-[220px]"}
      `}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.05]">
        <div className="w-8 h-8 bg-volt-400 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-obsidian-950 font-display font-700 text-sm">A</span>
        </div>
        {!collapsed && (
          <span className="font-display font-700 text-white text-sm tracking-tight">
            AdvisorAI
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-gray-600 hover:text-gray-300 transition-colors text-xs"
        >
          {collapsed ? "›" : "‹"}
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-hidden">
        {!collapsed && (
          <p className="section-label px-3 mb-3">Navigation</p>
        )}
        {NAV.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full text-left ${active ? "nav-item-active" : "nav-item"}`}
              title={collapsed ? item.label : ""}
            >
              <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User & Logout */}
      <div className="px-2 py-4 border-t border-white/[0.05] space-y-1">
        {!collapsed && (
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-gray-400 font-body truncate">{user?.name}</p>
            <p className="text-xs text-gray-600 font-mono truncate">{user?.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="nav-item w-full text-aurora-pink hover:text-aurora-pink hover:bg-aurora-pink/10"
        >
          <span className="text-base w-5 text-center">↩</span>
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
