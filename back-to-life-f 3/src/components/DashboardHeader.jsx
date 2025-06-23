import React from "react";

export default function DashboardHeader({ onLogout }) {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="header-logo">
          <img src="/logo.png" alt="Back to Life" />
          <div>
            <h1 className="header-title">Back to Life Clinician Dashboard</h1>
            <span className="header-status">● Live</span>
          </div>
        </div>
        <button onClick={onLogout} className="logout-btn">
          Sign Out
        </button>
      </div>
    </div>
  );
}
