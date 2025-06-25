import React, { useState, useMemo, useEffect } from "react";
import { differenceInWeeks, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import PatientTable from "../components/PatientTable";
import PatientModal from "../components/PatientModal";

// API function to fetch patients from backend
const fetchPatientsFromAPI = async () => {
  try {
    console.log('🔄 Fetching patients data from backend...');
    console.log('🔗 API URL:', 'http://localhost:3001/patients');
    console.log('⏰ Timestamp:', new Date().toISOString());
    
    // Create timeout controller for better browser compatibility
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch('http://localhost:3001/patients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    console.log('📡 Response status:', response.status);
    console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('📊 RAW API Response:', data);
    console.log('📊 Number of patients received:', data.length);
    console.log('📊 First patient sample:', data[0]);
    
    // Transform backend data to match frontend expectations
    console.log('🔄 Starting data transformation...');
    const transformedPatients = data.map((patient, index) => {
      console.log(`👤 Processing patient ${index + 1}:`, patient.name);
      console.log(`👤 Full patient object:`, patient);
      const latestScore = patient.srsScores?.[0];
      const srsScore = patient.latestSrsScore || latestScore?.srsScore || 0;
      console.log(`  📊 SRS Score: ${srsScore}`);
      
      // Use phase from backend - check both possible locations
      const phase = patient.phase?.label || patient.phase || 'RESET';
      console.log(`  🔄 Phase: ${phase}`);
      
      // Use real recovery points data from backend (start new patients at 0)
      const recoveryPoints = patient.recoveryPoints || {
        weeklyPoints: 0,
        trend: 'stable',
        streak: 0,
        completionRate: 0
      };
      
      const engagementStatus = patient.engagement || 
        (recoveryPoints.completionRate >= 80 ? 'highly_engaged' :
         recoveryPoints.completionRate >= 60 ? 'engaged' :
         recoveryPoints.completionRate >= 40 ? 'moderate' : 'low_engagement');
      
      return {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        patientId: `BTL-${String(patient.id).padStart(4, '0')}`,
        intakeDate: new Date(patient.intakeDate).toLocaleDateString(),
        phase,
        srsScore,
        groc: latestScore?.groc || 0,
        painLevel: latestScore?.vas || 0,
        confidence: latestScore?.confidence || 0,
        recoveryPoints,
        engagementStatus,
        lastContact: Math.floor(Math.random() * 30) + 1, // Days ago - TODO: get from backend
        lastUpdate: new Date(Date.now() - (Math.floor(Math.random() * 30) + 1) * 24 * 60 * 60 * 1000).toISOString(), // Convert days ago to actual date
        nextAppointment: patient.nextAppointment || new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        priority: srsScore < 4 ? 'high' : srsScore < 7 ? 'medium' : 'low',
        alerts: srsScore < 4 ? ['Low SRS Score'] : [],
        // Additional patient details for modal
        region: latestScore?.region || 'General',
        disabilityPercentage: latestScore?.disabilityPercentage || 0,
        vas: latestScore?.vas || 0,
        psfs: latestScore?.psfs || [],
        beliefs: latestScore?.beliefs || [],
        formType: latestScore?.formType || 'Initial Assessment',
        notes: `Patient showing ${phase.toLowerCase()} phase characteristics. SRS score: ${srsScore}/11.`
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
  if (srs <= 6) return "EDUCATE";
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

// Highlight if >4 weeks since last update
function needsFollowUp(lastUpdate) {
  return differenceInWeeks(new Date(), new Date(lastUpdate)) > 4;
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
      console.log('🔄 Auto-refreshing patient data...');
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
    if (customFilter === "followup") data = data.filter((p) => needsFollowUp(p.nextAppointment));
    if (customFilter === "highlyEngaged") data = data.filter((p) => 
      p.recoveryPoints && p.recoveryPoints.completionRate >= 80
    );
    if (customFilter === "lowEngagement") data = data.filter((p) => 
      p.recoveryPoints && p.recoveryPoints.completionRate < 50
    );

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
      // Here you would make API calls to delete from backend
      // For now, just remove from local state
      setPatients(patients.filter(p => !patientIds.includes(p.id)));
      
      // If any deleted patients were selected, clear selection
      setSelectedPatients([]);
      
      // Close modal if deleted patient was open
      if (expanded && patientIds.includes(expanded)) {
        setExpanded(null);
      }
      
      console.log(`Deleted ${patientIds.length} patients:`, patientIds);
    } catch (error) {
      console.error('Error deleting patients:', error);
      alert('Failed to delete patients. Please try again.');
    }
  };

  // Manual refresh function
  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
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
    console.log('📊 Card clicked:', filterType);
    setCustomFilter(filterType);
  };

  const clearFilter = () => {
    setCustomFilter(null);
  };

  // Calculate dashboard statistics
  const totalPatients = patients.length;
  const needAttention = patients.filter(p => p.priority === 'high' || p.alerts.length > 0).length;
  const followupDue = patients.filter(p => p.lastContact > 14).length;
  const lowEngagement = patients.filter(p => p.engagementStatus === 'low_engagement').length;

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
            console.log('🎯 Dashboard received click for patient ID:', patientId);
            console.log('🔍 Patient ID type:', typeof patientId);
            console.log('🔍 Available patient IDs:', patients.map(p => ({ id: p.id, type: typeof p.id, name: p.name })));
            const foundPatient = patients.find(p => p.id === patientId);
            console.log('🔍 Found patient:', foundPatient);
            console.log('🔄 Setting expanded to:', patientId);
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
      {console.log('🎭 Modal rendering check - expanded:', expanded, 'type:', typeof expanded)}
      {expanded && (
        <>
          {console.log('🔄 Rendering modal for expanded:', expanded)}
          {console.log('🔍 All patients:', patients)}
          {console.log('🔍 Looking for patient with ID:', expanded)}
          {console.log('🔍 Found patient:', patients.find((p) => p.id === expanded))}
          <PatientModal
            patient={patients.find((p) => p.id === expanded)}
            onClose={() => {
              console.log('🚪 Closing modal');
              setExpanded(null);
            }}
            needsFollowUp={needsFollowUp}
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            handleAddNote={handleAddNote}
          />
        </>
      )}
    </div>
  );
}

export default Dashboard;
