import React from "react";

const DashboardHeader = ({ onLogout, onRefresh, lastUpdated }) => {
  const formatLastUpdated = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-logo">
            <div className="logo-gradient">
              <span className="logo-text">BTL</span>
            </div>
            <div className="header-title">
              <h1 className="gradient-text">Back to Life</h1>
              <p className="header-subtitle">Clinician Dashboard</p>
            </div>
          </div>
          <div className="dashboard-status">
            <div className="status-indicator live"></div>
            <span className="status-text">Live Dashboard</span>
            {lastUpdated && (
              <span className="last-updated">
                Last updated: {formatLastUpdated(lastUpdated)}
              </span>
            )}
          </div>
        </div>
        
        <div className="header-actions">
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="refresh-btn"
              title="Refresh patient data"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          )}
          <button 
            onClick={onLogout}
            className="logout-btn"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default DashboardHeader;
