import React from "react";
import { format } from "date-fns";
import SRSDisplay from "./SRSDisplay";

export default function PatientTable({
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
  isFlagged,
  needsFollowUp,
  selectedPatients = [],
  setSelectedPatients,
  onDeletePatients,
}) {
  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const getPriorityAlert = (patient) => {
    const daysSinceLastContact = getDaysSinceLastContact(patient.lastUpdate);
    const daysSinceIntake = Math.floor((new Date() - new Date(patient.intakeDate)) / (1000 * 60 * 60 * 24));
    
    // 🚨 CRITICAL: High Priority - Multiple Risk Factors
    if (patient.painLevel >= 8 && patient.srsScore <= 2) {
      return { type: "high-priority", label: "High Priority", icon: "" };
    }
    
    // 🔻 DECLINING: SRS Score Drop (Most Important Clinical Indicator)
    if (patient.prevSrsScore && patient.prevSrsScore > patient.srsScore) {
      const scoreDrop = patient.prevSrsScore - patient.srsScore;
      if (scoreDrop >= 2) {
        return { type: "declining-severe", label: "Severe Decline", icon: "" };
      } else {
        return { type: "declining", label: "Score Declining", icon: "" };
      }
    }
    
    // 📱 DISENGAGEMENT: Portal Inactivity
    if (patient.recoveryPoints && patient.recoveryPoints.completionRate === 0 && daysSinceIntake >= 7) {
      return { type: "disengaged", label: "No Engagement", icon: "" };
    }
    
    // 📅 FOLLOW-UP DUE: No follow-up for 3+ weeks (21+ days)
    if (daysSinceLastContact >= 21) {
      return { type: "follow-up-due", label: "No Follow-up 3+ Weeks", icon: "" };
    }
    
    // 🔴 CRITICAL: Very Low SRS (Static Risk)
    if (patient.srsScore <= 2) {
      return { type: "critical", label: "Critical Score", icon: "" };
    }
    
    // ⚠️ MONITOR: Low SRS (Baseline Monitoring)
    if (patient.srsScore <= 4) {
      return { type: "medium-priority", label: "Monitor", icon: "" };
    }
    
    // ✅ No alerts for good scores with good engagement
    return null;
  };

  const getNextAppointment = (patient) => {
    // TODO: Get appointment data from backend when available
    return patient.nextAppointment || null;
  };

  const getEngagementStatus = (recoveryPoints, intakeDate) => {
    // Handle case where recoveryPoints might be undefined or null
    if (!recoveryPoints) return "unknown";
    
    // Calculate days since intake to determine if engagement assessment is appropriate
    const daysSinceIntake = Math.floor((new Date() - new Date(intakeDate)) / (1000 * 60 * 60 * 24));
    
    // Don't assess engagement for first week
    if (daysSinceIntake < 7) return "new_patient";
    
    const { completionRate = 0, trend = "stable", streakDays = 0 } = recoveryPoints;
    
    if (completionRate >= 80 && streakDays >= 5) return "highly-engaged";
    if (completionRate >= 60 && trend !== "declining") return "engaged";
    if (completionRate >= 40 || trend === "improving") return "moderate";
    return "low-engagement";
  };

  const getEngagementLabel = (status) => {
    switch (status) {
      case "highly-engaged": return "Highly Engaged";
      case "engaged": return "Engaged";
      case "moderate": return "Moderate";
      case "low-engagement": return "Low Engagement";
      case "new_patient": return "New Patient";
      case "unknown": return "No Data";
      default: return "Unknown";
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case "improving": return "📈";
      case "declining": return "📉";
      case "stable": return "➡️";
      default: return "—";
    }
  };

  const getDaysSinceLastContact = (lastUpdate) => {
    const days = Math.floor((new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const handleSelectPatient = (patientId, isSelected) => {
    if (isSelected) {
      setSelectedPatients([...selectedPatients, patientId]);
    } else {
      setSelectedPatients(selectedPatients.filter(id => id !== patientId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedPatients(patients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedPatients.length === 0) return;
    
    const patientNames = patients
      .filter(p => selectedPatients.includes(p.id))
      .map(p => p.name)
      .join(', ');
      
    if (window.confirm(`Are you sure you want to delete ${selectedPatients.length} patient(s)?\n\n${patientNames}\n\nThis action cannot be undone.`)) {
      onDeletePatients(selectedPatients);
      setSelectedPatients([]);
    }
  };

  return (
    <div className="patient-table-container">
      {/* Bulk Actions */}
      {selectedPatients.length > 0 && (
        <div style={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
          padding: '16px 24px', 
          borderRadius: '12px', 
          marginBottom: '16px',
          border: '1px solid #cbd5e1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#374151' }}>
              {selectedPatients.length} patient{selectedPatients.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleDeleteSelected}
              style={{
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
              onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🗑️ Delete Selected
            </button>
            <button
              onClick={() => setSelectedPatients([])}
              style={{
                background: 'white',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Enhanced Search and Filters */}
      <div className="table-header">
        <div className="search-section">
          <input
            type="text"
            placeholder="Search patients by name or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <select
            value={phaseFilter}
            onChange={(e) => setPhaseFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Phases</option>
            <option value="RESET">Reset Phase</option>
            <option value="EDUCATE">Educate Phase</option>
            <option value="REBUILD">Rebuild Phase</option>
          </select>
          <select
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value)}
            className="filter-select"
          >
            <option value="">All Patients</option>
            <option value="flagged">Flagged Only</option>
            <option value="unflagged">Not Flagged</option>
          </select>
          <select className="filter-select">
            <option value="">All Engagement</option>
            <option value="highly-engaged">Highly Engaged</option>
            <option value="engaged">Engaged</option>
            <option value="moderate">Moderate</option>
            <option value="low-engagement">Low Engagement</option>
          </select>
        </div>
      </div>

      {/* Streamlined Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#fafbfc', borderBottom: '1px solid #e1e5e9' }}>
              <th style={{ padding: '16px 20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: 700, color: '#374151', width: '50px' }}>
                <input
                  type="checkbox"
                  checked={selectedPatients.length === patients.length && patients.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  style={{ cursor: 'pointer' }}
                />
              </th>
              <th 
                style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                onClick={() => handleSort("name")}
              >
                Patient {sortCol === "name" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>
                Status & Alerts
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>
                Phase
              </th>
              <th 
                style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                onClick={() => handleSort("srs")}
              >
                SRS Score {sortCol === "srs" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
              <th style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 700, color: '#374151' }}>
                Engagement
              </th>
              <th 
                style={{ padding: '16px 20px', textAlign: 'left', fontSize: '0.9rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                onClick={() => handleSort("lastUpdate")}
              >
                Last Contact {sortCol === "lastUpdate" && (sortDir === "asc" ? "↑" : "↓")}
              </th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const priorityAlert = getPriorityAlert(patient);
              const nextAppointment = getNextAppointment(patient);
              const daysSinceContact = getDaysSinceLastContact(patient.lastUpdate);
              const engagementStatus = getEngagementStatus(patient.recoveryPoints, patient.intakeDate);
              
              return (
                <tr
                  key={patient.id}
                  className="table-row-interactive"
                  style={{ 
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  {/* Selection Checkbox */}
                  <td style={{ padding: '16px 20px', textAlign: 'center' }}>
                    <input
                      type="checkbox"
                      checked={selectedPatients.includes(patient.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectPatient(patient.id, e.target.checked);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  
                  {/* Patient Name with More Info */}
                  <td 
                    style={{ padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => {
                      onRowClick(patient.id);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 700,
                        fontSize: '0.9rem'
                      }}>
                        {patient.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>
                          {patient.name}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span>ID: {patient.id.toString().padStart(4, '0')}</span>
                          <span>•</span>
                          <span>Confidence: {patient.confidence}%</span>
                          {patient.painLevel && (
                            <>
                              <span>•</span>
                              <span>Pain: {patient.painLevel}/10</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Combined Status & Alerts */}
                  <td 
                    style={{ padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => onRowClick(patient.id)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {priorityAlert && (
                        <div className={`alert-badge ${priorityAlert.type}`}>
                          <span>{priorityAlert.icon}</span>
                          <span>{priorityAlert.label}</span>
                        </div>
                      )}
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(patient.intakeDate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        {nextAppointment && (
                          <div style={{ marginTop: '2px' }}>
                            Next: {new Date(nextAppointment.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Phase */}
                  <td 
                    style={{ padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => onRowClick(patient.id)}
                  >
                    <span className={`phase-badge ${patient.phase.toLowerCase()}`}>
                      {patient.phase}
                    </span>
                  </td>

                  {/* SRS Score with Status */}
                  <td 
                    style={{ padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => onRowClick(patient.id)}
                  >
                    <SRSDisplay 
                      score={patient.srsScore || 0}
                      clinicianAssessed={patient.clinicianAssessed || false}
                      grocCaptured={patient.grocCaptured || false}
                      variant="table"
                      className="text-sm"
                    />
                  </td>

                  {/* Consolidated Engagement */}
                  <td 
                    style={{ padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => onRowClick(patient.id)}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {patient.recoveryPoints ? (
                        <>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#1e293b' }}>
                              {patient.recoveryPoints.thisWeek || 0}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>pts</span>
                            <span style={{ fontSize: '0.9rem' }}>
                              {getTrendIcon(patient.recoveryPoints.trend)}
                            </span>
                            {patient.recoveryPoints.streakDays > 0 && (
                              <span style={{ 
                                fontSize: '0.75rem', 
                                background: '#ecfdf5', 
                                color: '#047857',
                                padding: '2px 4px',
                                borderRadius: '3px',
                                fontWeight: 600
                              }}>
                                🔥{patient.recoveryPoints.streakDays}d
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '60px', 
                              height: '4px', 
                              background: '#f1f5f9', 
                              borderRadius: '2px',
                              overflow: 'hidden'
                            }}>
                              <div style={{ 
                                width: `${patient.recoveryPoints.completionRate || 0}%`,
                                height: '100%',
                                background: (patient.recoveryPoints.completionRate || 0) >= 80 ? '#059669' : 
                                           (patient.recoveryPoints.completionRate || 0) >= 60 ? '#d97706' : '#dc2626',
                                borderRadius: '2px'
                              }}></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>
                              {patient.recoveryPoints.completionRate || 0}%
                            </span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {getEngagementLabel(engagementStatus)}
                          </div>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ fontSize: '0.9rem', color: '#64748b' }}>No engagement data</span>
                          <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>Patient portal not accessed</span>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Last Contact */}
                  <td 
                    style={{ padding: '16px 20px', cursor: 'pointer' }}
                    onClick={() => onRowClick(patient.id)}
                  >
                    <div>
                      <div style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
                        {daysSinceContact === 0 ? 'Today' : 
                         daysSinceContact === 1 ? 'Yesterday' : 
                         `${daysSinceContact} days ago`}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        {new Date(patient.lastUpdate).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Enhanced Footer with Statistics */}
      <div style={{ 
        padding: '20px', 
        borderTop: '1px solid #f1f5f9', 
        background: 'linear-gradient(135deg, #fafbfc 0%, #f4f6f8 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>
          Showing {patients.length} patients
        </div>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#059669', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Excellent (8+)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#0891b2', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Good (5-7)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#d97706', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Monitor (3-4)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '12px', height: '12px', background: '#dc2626', borderRadius: '50%' }}></div>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Critical (0-2)</span>
          </div>
        </div>
      </div>

      {patients.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '8px' }}>
            No patients found
          </div>
          <div style={{ fontSize: '0.9rem' }}>
            Try adjusting your search criteria or filters
          </div>
        </div>
      )}
    </div>
  );
}
