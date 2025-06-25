import React from "react";

export default function SRSDisplay({ score, clinicianAssessed = false, grocCaptured = false, className = "" }) {
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