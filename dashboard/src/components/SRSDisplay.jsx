import React from "react";

export default function SRSDisplay({ score, clinicianAssessed = false, grocCaptured = false, className = "", variant = "default" }) {
  
  // Simple variant for table display - clean and readable
  if (variant === "table") {
    const getScoreColor = (score) => {
      if (score >= 8) return "#059669"; // Green for excellent
      if (score >= 5) return "#0891b2"; // Blue for good
      if (score >= 3) return "#d97706"; // Orange for needs attention
      return "#dc2626"; // Red for critical
    };

    const getScoreBackground = (score) => {
      if (score >= 8) return "#d1fae5"; // Light green
      if (score >= 5) return "#cffafe"; // Light blue
      if (score >= 3) return "#fed7aa"; // Light orange
      return "#fecaca"; // Light red
    };

    return (
      <div className={`flex items-center justify-center ${className}`}>
        {/* Clean score badge - no status text */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: '40px',
          height: '28px',
          paddingLeft: '10px',
          paddingRight: '10px',
          borderRadius: '8px',
          backgroundColor: getScoreBackground(score),
          border: `2px solid ${getScoreColor(score)}`,
          fontWeight: '700',
          fontSize: '1rem',
          color: getScoreColor(score)
        }}>
          {score}
        </div>
      </div>
    );
  }

  // Compact variant for smaller spaces
  if (variant === "compact") {
    const getScoreColor = (score) => {
      if (score >= 8) return "#059669";
      if (score >= 5) return "#0891b2";
      if (score >= 3) return "#d97706";
      return "#dc2626";
    };

    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <span style={{
          fontSize: '1.125rem',
          fontWeight: 'bold',
          color: getScoreColor(score)
        }}>
          {score}
        </span>
        <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
          / 11
        </span>
      </div>
    );
  }

  // Default variant (original with locks) for detailed views
  const lockedPoints = (clinicianAssessed ? 0 : 2) + (grocCaptured ? 0 : 1);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <span className="text-xl font-bold">{score}</span>
      <span className="text-gray-600">/ 11</span>

      {lockedPoints > 0 && (
        <div className="relative group">
          <span className="ml-2 inline-flex items-center rounded bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600 cursor-help">
            🔒 {lockedPoints}
          </span>
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
            {lockedPoints} points locked until assessment
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-800"></div>
          </div>
        </div>
      )}
    </div>
  );
} 