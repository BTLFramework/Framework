import React from "react";
import { format } from "date-fns";

function PatientTable({
  patients,
  search,
  setSearch,
  phaseFilter,
  setPhaseFilter,
  flagFilter,
  setFlagFilter,
  sortCol,
  setSortCol,
  sortDir,
  setSortDir,
  onRowClick,
  getPhase,
  isFlagged,
  needsFollowUp,
}) {
  // SRS color badge
  const srsBadge = (srs) => {
    let color =
      srs >= 7
        ? "bg-green-100 text-green-800 border-green-300"
        : srs >= 4
        ? "bg-yellow-100 text-yellow-800 border-yellow-300"
        : "bg-red-100 text-red-800 border-red-300";
    return (
      <span
        className={`inline-block min-w-[2.5rem] text-center border px-2 py-1 rounded-full text-xs font-semibold ${color}`}
      >
        {srs}
      </span>
    );
  };

  // Phase badge
  const phaseBadge = (phase) => {
    const color =
      phase === "RESET"
        ? "bg-blue-100 text-blue-800"
        : phase === "EDUCATE"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-green-100 text-green-800";
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${color}`}>
        {phase}
      </span>
    );
  };

  // Confidence slider bar
  const confidenceBar = (confidence) => {
    let barColor =
      confidence >= 7
        ? "bg-green-400"
        : confidence >= 4
        ? "bg-yellow-400"
        : "bg-red-400";
    return (
      <div className="flex items-center gap-2">
        <div className="w-20 h-2 bg-gray-200 rounded">
          <div
            className={`h-2 rounded ${barColor}`}
            style={{ width: `${(confidence / 10) * 100}%` }}
          ></div>
        </div>
        <span className="text-xs text-gray-700">{confidence}</span>
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by patient name"
          className="border border-blue-200 px-3 py-2 rounded-lg w-full md:w-1/3 focus:ring-2 focus:ring-blue-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
        >
          <option value="">All Phases</option>
          <option value="RESET">Reset</option>
          <option value="EDUCATE">Educate</option>
          <option value="REBUILD">Rebuild</option>
        </select>
        <select
          className="border border-blue-200 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-200"
          value={flagFilter}
          onChange={(e) => setFlagFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="flagged">Flagged</option>
          <option value="unflagged">Unflagged</option>
        </select>
      </div>
      <div className="overflow-x-auto rounded-lg border border-blue-100">
        <table className="min-w-full text-sm bg-white">
          <thead>
            <tr className="bg-blue-50 border-b border-blue-100">
              {[
                {
                  key: "name",
                  label: "Patient Name",
                },
                {
                  key: "intakeDate",
                  label: "Intake Date",
                },
                {
                  key: "phase",
                  label: "Current Phase",
                },
                {
                  key: "srs",
                  label: "Signature Recovery Score (SRS)",
                },
                {
                  key: "groc",
                  label: "GROC",
                },
                {
                  key: "pain",
                  label: "Pain Score (VAS)",
                },
                {
                  key: "confidence",
                  label: "Confidence Level",
                },
                {
                  key: "flag",
                  label: "Flag Status",
                },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left font-semibold text-blue-900 cursor-pointer select-none"
                  onClick={() => {
                    if (col.key === "flag") return;
                    setSortCol(col.key === "phase" ? "srs" : col.key);
                    setSortDir(
                      sortCol === (col.key === "phase" ? "srs" : col.key) &&
                        sortDir === "asc"
                        ? "desc"
                        : "asc"
                    );
                  }}
                >
                  {col.label}
                  {sortCol === (col.key === "phase" ? "srs" : col.key) && (
                    <span>{sortDir === "asc" ? " ▲" : " ▼"}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                className={`hover:bg-blue-50 cursor-pointer border-b border-blue-50 transition ${
                  needsFollowUp(p.lastUpdate) ? "bg-yellow-50" : ""
                }`}
                onClick={() => onRowClick(p.id)}
              >
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3">
                  {format(new Date(p.intakeDate), "yyyy-MM-dd")}
                </td>
                <td className="px-4 py-3">{phaseBadge(getPhase(p.srs))}</td>
                <td className="px-4 py-3">{srsBadge(p.srs)}</td>
                <td className="px-4 py-3">{p.groc}</td>
                <td className="px-4 py-3">{p.pain}</td>
                <td className="px-4 py-3">{confidenceBar(p.confidence)}</td>
                <td className="px-4 py-3 text-center">
                  {isFlagged(p) ? (
                    <span className="inline-block w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                      <span className="text-red-600 text-lg">🔴</span>
                    </span>
                  ) : (
                    <span className="inline-block w-6 h-6" />
                  )}
                </td>
              </tr>
            ))}
            {patients.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-4 text-gray-400">
                  No patients found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default PatientTable;
