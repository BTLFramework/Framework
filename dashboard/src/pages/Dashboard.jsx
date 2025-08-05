import React, { useState, useMemo, useEffect } from "react";
import { differenceInWeeks, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config/api";
import DashboardHeader from "../components/DashboardHeader";
import PatientTable from "../components/PatientTable";
import PatientModal from "../components/PatientModal";
import FilteredPatientsModal from "../components/FilteredPatientsModal";

// CACHE BUSTER: Force bundle change - timestamp: 2024-08-04-23:30
console.log('🔥 DASHBOARD CACHE BUSTER: This should force bundle change!');
console.log('🔥 API_URL being used:', API_URL);

// API function to fetch patients from backend
const fetchPatientsFromAPI = async () => {
  try {
    // Create timeout controller for better browser compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
      const response = await fetch(`${API_URL}/patients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    
    // Transform backend data to match frontend expectations
    const transformedPatients = data.map((patient, index) => {
      // Use SRS score directly from API response
      const srsScore = patient.srs || 0;
      
      // Use phase from backend
      const phase = patient.phase || 'RESET';
      
      // Use real recovery points data from backend
      const recoveryPoints = patient.recoveryPoints || {
        weeklyPoints: 0,
        trend: 'stable',
        streak: 0,
        completionRate: 0
      };
      
      // Calculate days since intake to determine if engagement assessment is appropriate
      const daysSinceIntake = Math.floor((new Date() - new Date(patient.intakeDate)) / (1000 * 60 * 60 * 24));
      
      const engagementStatus = patient.engagement || 
        (daysSinceIntake < 7 ? 'new_patient' : // Don't assess engagement for first week
         recoveryPoints.completionRate >= 80 ? 'highly_engaged' :
         recoveryPoints.completionRate >= 60 ? 'engaged' :
         recoveryPoints.completionRate >= 40 ? 'moderate' : 'low_engagement');
      
      return {
        // Spread all original API fields first
        ...patient,
        // Add transformed/computed fields on top
        patientId: `BTL-${String(patient.id).padStart(4, '0')}`,
        intakeDate: new Date(patient.intakeDate).toLocaleDateString(),
        phase,
        srsScore,
        painLevel: patient.painScore || 0,
        vas: patient.painScore || 0,
        disabilityPercentage: patient.disabilityIndex || 0,
        recoveryPoints,
        engagementStatus,
        lastContact: patient.lastContact || 0,
        lastUpdate: patient.lastUpdate || patient.intakeDate,
        nextAppointment: patient.nextAppointment || 'Not scheduled',
        priority: srsScore < 4 ? 'high' : srsScore < 7 ? 'medium' : 'low',
        alerts: srsScore < 4 ? ['Low SRS Score'] : [],
        notes: `Patient showing ${phase.toLowerCase()} phase characteristics. SRS score: ${srsScore}/11.`,
        latestSrsScore: srsScore,
        prevSrsScore: patient.prevSrs || null,
        portalLastLogin: patient.portalLastLogin || null,
        appointmentGap: patient.appointmentGap || 0
      };
    });
    
    return transformedPatients;
  } catch (err) {
    console.error('❌ Error fetching patients:', err);
    
    // Provide more specific error messages
    if (err.name === 'AbortError') {
      throw new Error('Request timed out - backend server may be slow or unresponsive');
    } else if (err.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to backend server. Please ensure the server is running on port 3001.');
    } else if (err.message.includes('NetworkError')) {
      throw new Error('Network error - please check your internet connection and backend server status.');
    }
    
    throw err;
  }
};

// Helper to determine phase from SRS
function getPhase(srs) {
  if (srs <= 3) return "RESET";
  if (srs <= 7) return "EDUCATE";
  return "REBUILD";
}

// Flag logic
function isFlagged(patient) {
  return (
    patient.confidence <= 5 ||
    patient.groc <= 0 ||
    (typeof patient.prevSrsScore === "number" && patient.prevSrsScore - patient.srsScore >= 2)
  );
}

// Check if patient needs follow-up (3+ weeks since last contact)
function needsFollowUp(lastUpdate) {
  const daysSinceLastContact = Math.floor((new Date() - new Date(lastUpdate)) / (1000 * 60 * 60 * 24));
  return daysSinceLastContact >= 21; // 3+ weeks
}

function Dashboard() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [flagFilter, setFlagFilter] = useState("");
  const [customFilter, setCustomFilter] = useState(null);
  const [sortCol, setSortCol] = useState("intakeDate");
  const [sortDir, setSortDir] = useState("desc");
  const [expanded, setExpanded] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [filteredPatientsModal, setFilteredPatientsModal] = useState({ isOpen: false, filterType: null });

  // Fetch patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPatients = await fetchPatientsFromAPI();
        setPatients(fetchedPatients);
        setLastUpdated(new Date());
      } catch (err) {
        setError(err.message);
        console.error('Failed to load patients:', err);
        // Fallback to empty array
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    loadPatients();
  }, []);

      // Set up real-time refresh every 30 seconds
    useEffect(() => {
      const interval = setInterval(() => {
        fetchPatientsFromAPI()
          .then(fetchedPatients => {
            setPatients(fetchedPatients);
            setLastUpdated(new Date());
          })
          .catch(err => {
            console.error('❌ Error refreshing patient data:', err);
            setError(err.message);
          });
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredPatients = useMemo(() => {
    let data = [...patients];
    if (search)
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    if (phaseFilter) data = data.filter((p) => p.phase === phaseFilter);
    if (flagFilter === "flagged") data = data.filter((p) => isFlagged(p));
    if (flagFilter === "unflagged") data = data.filter((p) => !isFlagged(p));
    
    // Handle custom filters
    if (customFilter === "excellent") data = data.filter((p) => p.srsScore >= 8);
    if (customFilter === "followup") data = data.filter((p) => needsFollowUp(p.lastUpdate));
    if (customFilter === "highlyEngaged") data = data.filter((p) => 
      p.recoveryPoints && p.recoveryPoints.completionRate >= 80
    );
    if (customFilter === "lowEngagement") data = data.filter((p) => {
      const daysSinceIntake = Math.floor((new Date() - new Date(p.intakeDate)) / (1000 * 60 * 60 * 24));
      return p.recoveryPoints && p.recoveryPoints.completionRate < 50 && daysSinceIntake >= 7;
    });

    // Sort
    data.sort((a, b) => {
      let aVal = a[sortCol];
      let bVal = b[sortCol];
      if (sortCol === "intakeDate" || sortCol === "nextAppointment" || sortCol === "lastUpdate") {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [patients, search, phaseFilter, flagFilter, customFilter, sortCol, sortDir]);

  const handleAddNote = (id) => {
    if (!noteInput.trim()) return;
    
    // In a real app, this would make an API call to save the note
    const updatedPatients = patients.map((patient) => {
      if (patient.id === id) {
        return {
          ...patient,
          notes: [
            ...patient.notes,
            {
              text: noteInput,
              timestamp: format(new Date(), "MMM dd, yyyy 'at' h:mm a"),
            },
          ],
        };
      }
      return patient;
    });
    
    setPatients(updatedPatients);
    setNoteInput("");
  };

  const handleDeletePatients = async (patientIds) => {
    try {
      console.log('🗑️ Deleting patients:', patientIds);
      
      // Delete each patient from the backend
      const deletePromises = patientIds.map(async (patientId) => {
    const response = await fetch(`${API_URL}/patients/${patientId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Failed to delete patient ${patientId}: ${errorData.message || response.statusText}`);
        }
        
        return response.json();
      });
      
      // Wait for all deletions to complete
      await Promise.all(deletePromises);
      
      // Remove deleted patients from local state
      setPatients(patients.filter(p => !patientIds.includes(p.id)));
      
      // If any deleted patients were selected, clear selection
      setSelectedPatients([]);
      
      // Close modal if deleted patient was open
      if (expanded && patientIds.includes(expanded)) {
        setExpanded(null);
      }
      
      console.log('✅ Successfully deleted patients:', patientIds);
      
    } catch (error) {
      console.error('❌ Error deleting patients:', error);
      alert(`Failed to delete patients: ${error.message}`);
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    setLoading(true);
    fetchPatientsFromAPI()
      .then(fetchedPatients => {
        setPatients(fetchedPatients);
        setLastUpdated(new Date());
      })
      .catch(err => {
        console.error('❌ Error refreshing patient data:', err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  // Filter functions for dashboard cards
  const handleCardClick = (filterType) => {
    // Skip modal for "Total Patients" - just clear filters
    if (filterType === 'all') {
      setCustomFilter(null);
      return;
    }
    
    // Open modal for specific filters
    setFilteredPatientsModal({ isOpen: true, filterType });
  };

  const clearFilter = () => {
    setCustomFilter(null);
  };

  // Calculate dashboard statistics using refined clinical logic
  const totalPatients = patients.length;
  
  const needAttention = patients.filter(p => {
    const daysSinceLastContact = Math.floor((new Date() - new Date(p.lastUpdate)) / (1000 * 60 * 60 * 24));
    const daysSinceIntake = Math.floor((new Date() - new Date(p.intakeDate)) / (1000 * 60 * 60 * 24));
    
    // 🚨 HIGH PRIORITY: Critical situations requiring immediate attention
    if (p.painLevel >= 8 && p.srsScore <= 2) return true; // High pain + critical score
    if (p.prevSrsScore && p.prevSrsScore > p.srsScore) return true; // Declining scores
    if (p.recoveryPoints && p.recoveryPoints.completionRate === 0 && daysSinceIntake >= 7) return true; // No engagement
    
    // 📞 COMMUNICATION GAPS: Adjusted by phase (but exclude routine follow-ups)
    // RESET patients need more frequent contact (21+ days = flag)
    if (p.phase === 'RESET' && daysSinceLastContact >= 21) return true;
    // EDUCATE/REBUILD patients can go longer without contact (35+ days = flag)
    if ((p.phase === 'EDUCATE' || p.phase === 'REBUILD') && daysSinceLastContact >= 35) return true;
    
    // 🔴 CRITICAL SCORES: Only flag if truly stuck in wrong phase
    // RESET phase patients with SRS 0-2 (not progressing after reasonable time)
    if (p.phase === 'RESET' && p.srsScore <= 2 && daysSinceIntake >= 14) return true;
    
    // Don't flag EDUCATE patients (4-7) or REBUILD patients (8+) based on score alone
    // They are progressing through the blueprint as expected
    
    return false;
  }).length;
  
  const followupDue = patients.filter(p => needsFollowUp(p.lastUpdate)).length;
  
  const lowEngagement = patients.filter(p => {
    const daysSinceIntake = Math.floor((new Date() - new Date(p.intakeDate)) / (1000 * 60 * 60 * 24));
    return p.recoveryPoints && p.recoveryPoints.completionRate < 50 && daysSinceIntake >= 7;
  }).length;

  // Loading state
  if (loading && patients.length === 0) {
    return (
      <div className="dashboard-container">
        <DashboardHeader onLogout={handleLogout} onRefresh={handleRefresh} lastUpdated={lastUpdated} />
        <div className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ 
                width: '2rem', 
                height: '2rem', 
                border: '2px solid #e5e7eb', 
                borderTop: '2px solid #2563eb',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 1rem auto'
              }}></div>
              <p className="text-secondary">Loading patient data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <DashboardHeader onLogout={handleLogout} onRefresh={handleRefresh} lastUpdated={lastUpdated} />
        <div className="dashboard-content">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="text-error" style={{ marginBottom: '1rem' }}>⚠️ Error loading data</div>
              <p className="text-secondary" style={{ marginBottom: '1rem' }}>{error}</p>
              <button
                onClick={handleRefresh}
                className="btn-primary"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader onLogout={handleLogout} onRefresh={handleRefresh} lastUpdated={lastUpdated} />
      
      <main className="dashboard-content">
        {/* Dashboard Overview Cards */}
        <div className="overview-grid">
          {/* Total Patients */}
          <div 
            className="overview-card"
            onClick={() => handleCardClick('all')}
          >
            <div className="overview-card-content">
              <div className="overview-icon total">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Total Patients</h3>
                <p>{totalPatients}</p>
              </div>
            </div>
          </div>

          {/* Need Attention */}
          <div 
            className="overview-card"
            onClick={() => handleCardClick('attention')}
          >
            <div className="overview-card-content">
              <div className="overview-icon attention">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Need Attention</h3>
                <p>{needAttention}</p>
              </div>
            </div>
          </div>

          {/* Follow-up Due */}
          <div 
            className="overview-card"
            onClick={() => handleCardClick('followup')}
          >
            <div className="overview-card-content">
              <div className="overview-icon followup">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Follow-up Due</h3>
                <p>{followupDue}</p>
              </div>
            </div>
          </div>

          {/* Low Engagement */}
          <div 
            className="overview-card"
            onClick={() => handleCardClick('low_engagement')}
          >
            <div className="overview-card-content">
              <div className="overview-icon attention">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Low Engagement</h3>
                <p>{lowEngagement}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Distribution */}
        <div className="phase-section">
          <h3 className="phase-title">Recovery Phase Distribution</h3>
          <div className="phase-bars">
            {['RESET', 'EDUCATE', 'REBUILD'].map(phase => {
              const phaseCount = patients.filter(p => p.phase === phase).length;
              const percentage = totalPatients > 0 ? (phaseCount / totalPatients) * 100 : 0;
              
              return (
                <div 
                  key={phase}
                  className="phase-bar"
                  onClick={() => handleCardClick(phase.toLowerCase())}
                >
                  <div className="phase-bar-header">
                    <span className="phase-bar-label">{phase}</span>
                    <span className="phase-bar-count">{phaseCount} patients</span>
                  </div>
                  <div className={`phase-bar-fill ${phase.toLowerCase()}`}>
                    <div
                      className={`phase-bar-progress ${phase.toLowerCase()}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient Table */}
        <PatientTable
          patients={filteredPatients}
          search={search}
          setSearch={setSearch}
          phaseFilter={phaseFilter}
          setPhaseFilter={setPhaseFilter}
          flagFilter={flagFilter}
          setFlagFilter={setFlagFilter}
          sortCol={sortCol}
          setSortCol={setSortCol}
          sortDir={sortDir}
          setSortDir={setSortDir}
          onRowClick={(patientId) => {
            setExpanded(patientId);
          }}
          isFlagged={isFlagged}
          needsFollowUp={needsFollowUp}
          selectedPatients={selectedPatients}
          setSelectedPatients={setSelectedPatients}
          onDeletePatients={handleDeletePatients}
          customFilter={customFilter}
          onClearFilter={clearFilter}
        />
      </main>

      {/* Patient Modal */}
      {expanded && (
        <>
          <PatientModal
            patient={patients.find((p) => p.id === expanded)}
            onClose={() => {
              setExpanded(null);
            }}
            needsFollowUp={needsFollowUp}
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            handleAddNote={handleAddNote}
          />
        </>
      )}

      {/* Filtered Patients Modal */}
      {filteredPatientsModal.isOpen && (
        <FilteredPatientsModal
          isOpen={filteredPatientsModal.isOpen}
          onClose={() => setFilteredPatientsModal({ isOpen: false, filterType: null })}
          filterType={filteredPatientsModal.filterType}
          patients={patients}
          isFlagged={isFlagged}
          needsFollowUp={needsFollowUp}
          onDeletePatients={handleDeletePatients}
        />
      )}
    </div>
  );
}

export default Dashboard;
