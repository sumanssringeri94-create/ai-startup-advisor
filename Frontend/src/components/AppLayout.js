// src/components/AppLayout.js
// Wraps all authenticated pages with sidebar + navbar

import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = ({ children, title, subtitle }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-obsidian-950">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
