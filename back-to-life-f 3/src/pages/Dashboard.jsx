import React, { useState, useMemo, useEffect } from "react";
import { differenceInWeeks, format } from "date-fns";
import { useNavigate } from "react-router-dom";
import DashboardHeader from "../components/DashboardHeader";
import PatientTable from "../components/PatientTable";
import PatientModal from "../components/PatientModal";

// API function to fetch patients from backend
const fetchPatientsFromAPI = async () => {
  try {
    const response = await fetch('http://localhost:3001/patients', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const backendPatients = await response.json();
    console.log('Fetched patients from API:', backendPatients);
    
    // Transform backend data to match frontend expectations
    const transformedPatients = backendPatients.map(patient => {
      const latestScore = patient.srsScores?.[0];
      
      return {
        id: patient.id,
        name: patient.name,
        email: patient.email,
        intakeDate: patient.intakeDate,
        lastUpdate: latestScore?.date || patient.intakeDate,
        srs: latestScore?.srsScore || 0,
        groc: latestScore?.groc || 0,
        pain: latestScore?.vas || 0,
        confidence: latestScore?.confidence || 0,
        phase: getPhase(latestScore?.srsScore || 0),
        notes: [],
        prevSrs: null, // Would need to fetch previous scores for this
        recoveryPoints: {
          total: Math.floor(Math.random() * 100) + 50, // Mock data for now
          weekly: Math.floor(Math.random() * 20) + 5,
          trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 3)],
          streak: Math.floor(Math.random() * 30) + 1,
          completionRate: Math.floor(Math.random() * 50) + 50,
          lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString() // Last 30 days max
        }
      };
    });
    
    return transformedPatients;
  } catch (error) {
    console.error('Error fetching patients:', error);
    throw error;
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
    (typeof patient.prevSrs === "number" && patient.prevSrs - patient.srs >= 2)
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
  const [customFilter, setCustomFilter] = useState("");
  const [sortCol, setSortCol] = useState("intakeDate");
  const [sortDir, setSortDir] = useState("desc");
  const [expanded, setExpanded] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);

  // Fetch patients on component mount
  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        setError(null);
        const fetchedPatients = await fetchPatientsFromAPI();
        setPatients(fetchedPatients);
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
    if (phaseFilter) data = data.filter((p) => getPhase(p.srs) === phaseFilter);
    if (flagFilter === "flagged") data = data.filter((p) => isFlagged(p));
    if (flagFilter === "unflagged") data = data.filter((p) => !isFlagged(p));
    
    // Handle custom filters
    if (customFilter === "excellent") data = data.filter((p) => p.srs >= 8);
    if (customFilter === "followup") data = data.filter((p) => needsFollowUp(p.lastUpdate));
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
      if (sortCol === "intakeDate" || sortCol === "lastUpdate") {
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

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container">
        <DashboardHeader onLogout={handleLogout} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-secondary">Loading patient data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container">
        <DashboardHeader onLogout={handleLogout} />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-error text-4xl mb-4">⚠️</div>
            <h3 className="text-title text-primary mb-2">Failed to Load Patient Data</h3>
            <p className="text-secondary mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader onLogout={handleLogout} />

      <div className="dashboard-content">
        {/* Dashboard Overview */}
        <div className="overview-grid">
          {/* Total Patients */}
          <div 
            className="overview-card group cursor-pointer"
            onClick={() => setCustomFilter("")}
          >
            <div className="overview-card-content">
              <div className="overview-icon total">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Total Patients</h3>
                <p>{patients.length}</p>
              </div>
            </div>
          </div>

          {/* Need Attention */}
          <div 
            className="overview-card group cursor-pointer"
            onClick={() => setFlagFilter("flagged")}
          >
            <div className="overview-card-content">
              <div className="overview-icon attention">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Need Attention</h3>
                <p>{patients.filter(p => isFlagged(p)).length}</p>
              </div>
            </div>
          </div>

          {/* Follow-up Due */}
          <div 
            className="overview-card group cursor-pointer"
            onClick={() => setCustomFilter("followup")}
          >
            <div className="overview-card-content">
              <div className="overview-icon followup">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Follow-up Due</h3>
                <p>{patients.filter(p => needsFollowUp(p.lastUpdate)).length}</p>
              </div>
            </div>
          </div>

          {/* Low Engagement */}
          <div 
            className="overview-card group cursor-pointer"
            onClick={() => setCustomFilter("lowEngagement")}
          >
            <div className="overview-card-content">
              <div className="overview-icon followup">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <div className="overview-text">
                <h3>Low Engagement</h3>
                <p>
                  {patients.filter(p => p.recoveryPoints && p.recoveryPoints.completionRate < 50).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Distribution */}
        <div className="phase-section">
          <h3 className="phase-title">Recovery Phase Distribution</h3>
          <div className="phase-bars">
            {/* RESET Phase */}
            <div className="phase-bar" onClick={() => setPhaseFilter("RESET")}>
              <div className="phase-bar-header">
                <div className="flex items-center space-x-3">
                  <span className="phase-bar-label">RESET Phase</span>
                </div>
                <span className="phase-bar-count">{patients.filter(p => getPhase(p.srs) === "RESET").length} patients</span>
              </div>
              <div className="phase-bar-fill reset">
                <div 
                  className="phase-bar-progress reset"
                  style={{ width: `${patients.length > 0 ? (patients.filter(p => getPhase(p.srs) === "RESET").length / patients.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* EDUCATE Phase */}
            <div className="phase-bar" onClick={() => setPhaseFilter("EDUCATE")}>
              <div className="phase-bar-header">
                <div className="flex items-center space-x-3">
                  <span className="phase-bar-label">EDUCATE Phase</span>
                </div>
                <span className="phase-bar-count">{patients.filter(p => getPhase(p.srs) === "EDUCATE").length} patients</span>
              </div>
              <div className="phase-bar-fill educate">
                <div 
                  className="phase-bar-progress educate"
                  style={{ width: `${patients.length > 0 ? (patients.filter(p => getPhase(p.srs) === "EDUCATE").length / patients.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* REBUILD Phase */}
            <div className="phase-bar" onClick={() => setPhaseFilter("REBUILD")}>
              <div className="phase-bar-header">
                <div className="flex items-center space-x-3">
                  <span className="phase-bar-label">REBUILD Phase</span>
                </div>
                <span className="phase-bar-count">{patients.filter(p => getPhase(p.srs) === "REBUILD").length} patients</span>
              </div>
              <div className="phase-bar-fill rebuild">
                <div 
                  className="phase-bar-progress rebuild"
                  style={{ width: `${patients.length > 0 ? (patients.filter(p => getPhase(p.srs) === "REBUILD").length / patients.length) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
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
          onRowClick={setExpanded}
          getPhase={getPhase}
          isFlagged={isFlagged}
          needsFollowUp={needsFollowUp}
          selectedPatients={selectedPatients}
          setSelectedPatients={setSelectedPatients}
          onDeletePatients={handleDeletePatients}
        />

        {/* Patient Modal */}
        {expanded && (
          <PatientModal
            patient={patients.find((p) => p.id === expanded)}
            onClose={() => setExpanded(null)}
            getPhase={getPhase}
            needsFollowUp={needsFollowUp}
            noteInput={noteInput}
            setNoteInput={setNoteInput}
            handleAddNote={handleAddNote}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
