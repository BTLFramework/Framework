import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const DashboardHeader = ({ onLogout, onRefresh, lastUpdated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const formatLastUpdated = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  // Fetch unread message count
  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('https://framework-production-92f5.up.railway.app/api/messages/conversations');
        
        if (response.ok) {
          const result = await response.json();
          
          if (result.success) {
            // Count total unread messages from all conversations
            const totalUnread = result.conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);
            setUnreadMessageCount(totalUnread);
          }
        }
      } catch (error) {
        console.error('Error fetching unread message count:', error);
        // Silently fail - don't show error to user for notification badge
      }
    };

    fetchUnreadCount();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-logo">
            <div className="logo-gradient">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="header-title">
              <h1>Back to Life</h1>
              <p className="header-subtitle">Clinical Dashboard</p>
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
          {/* Navigation buttons */}
          <button 
            onClick={() => handleNavigation('/dashboard')}
            className={`nav-btn ${location.pathname === '/dashboard' ? 'active' : ''}`}
            title="Dashboard"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v4H8V5z" />
            </svg>
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => handleNavigation('/messages')}
            className={`nav-btn ${location.pathname === '/messages' ? 'active' : ''}`}
            title="Messages"
            style={{ position: 'relative' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Messages</span>
            {/* Notification badge */}
            {unreadMessageCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '-6px',
                right: '-6px',
                minWidth: '18px',
                height: '18px',
                backgroundColor: '#dc2626',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                animation: unreadMessageCount > 0 ? 'pulse 2s infinite' : 'none'
              }}>
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </div>
            )}
          </button>

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
