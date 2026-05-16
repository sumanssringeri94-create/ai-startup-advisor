// src/App.js
// ─────────────────────────────────────────────
// Root component — sets up routing and auth context
// ─────────────────────────────────────────────

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute  from "./components/ProtectedRoute";

import LandingPage   from "./pages/LandingPage";
import LoginPage     from "./pages/LoginPage";
import SignupPage    from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import ChatPage      from "./pages/ChatPage";
import StartupPage   from "./pages/StartupPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/"       element={<LandingPage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Protected routes — require a valid JWT */}
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/chat"      element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/startup"   element={<ProtectedRoute><StartupPage /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />

          {/* Catch-all: redirect unknown paths to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
