import React from "react";

function DashboardHeader({ onLogout }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4 border-b pb-4">
      <h2 className="text-3xl font-extrabold text-blue-900 tracking-tight">
        Patient Dashboard
      </h2>
      <button
        onClick={onLogout}
        className="bg-red-50 text-red-700 border border-red-200 px-5 py-2 rounded-lg hover:bg-red-100 transition font-semibold"
      >
        Logout
      </button>
    </div>
  );
}

export default DashboardHeader;
