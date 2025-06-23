import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { format, differenceInWeeks } from "date-fns";
import DashboardHeader from "../components/DashboardHeader";
import PatientTable from "../components/PatientTable";
import PatientModal from "../components/PatientModal";

// Mock patient data (move to a separate file if needed)
const mockPatients = [
  {
    id: 1,
    name: "John Doe",
    intakeDate: "2024-05-01",
    srs: 5,
    prevSrs: 7,
    groc: 1,
    pain: 4,
    confidence: 6,
    phase: "EDUCATE",
    psfs: [
      { activity: "Walking", score: 7 },
      { activity: "Lifting", score: 5 },
    ],
    beliefStatus: "Positive",
    disabilityIndex: 30,
    lastUpdate: "2024-05-15",
    notes: [{ text: "Doing well", timestamp: "2024-05-15" }],
  },
  {
    id: 2,
    name: "Jane Smith",
    intakeDate: "2024-04-10",
    srs: 2,
    prevSrs: 4,
    groc: -1,
    pain: 7,
    confidence: 4,
    phase: "RESET",
    psfs: [
      { activity: "Running", score: 3 },
      { activity: "Sitting", score: 2 },
    ],
    beliefStatus: "Neutral",
    disabilityIndex: 60,
    lastUpdate: "2024-04-12",
    notes: [],
  },
  {
    id: 3,
    name: "Alice Johnson",
    intakeDate: "2024-03-20",
    srs: 8,
    prevSrs: 8,
    groc: 2,
    pain: 2,
    confidence: 9,
    phase: "REBUILD",
    psfs: [
      { activity: "Cycling", score: 8 },
      { activity: "Swimming", score: 9 },
    ],
    beliefStatus: "Positive",
    disabilityIndex: 10,
    lastUpdate: "2024-06-01",
    notes: [{ text: "Needs follow-up", timestamp: "2024-06-01" }],
  },
];

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
  const [search, setSearch] = useState("");
  const [phaseFilter, setPhaseFilter] = useState("");
  const [flagFilter, setFlagFilter] = useState("");
  const [sortCol, setSortCol] = useState("intakeDate");
  const [sortDir, setSortDir] = useState("desc");
  const [expanded, setExpanded] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const filteredPatients = useMemo(() => {
    let data = [...mockPatients];
    if (search)
      data = data.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    if (phaseFilter) data = data.filter((p) => getPhase(p.srs) === phaseFilter);
    if (flagFilter === "flagged") data = data.filter((p) => isFlagged(p));
    if (flagFilter === "unflagged") data = data.filter((p) => !isFlagged(p));
    data.sort((a, b) => {
      let vA = a[sortCol],
        vB = b[sortCol];
      if (sortCol === "intakeDate" || sortCol === "lastUpdate") {
        vA = new Date(vA);
        vB = new Date(vB);
      }
      if (vA < vB) return sortDir === "asc" ? -1 : 1;
      if (vA > vB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return data;
  }, [search, phaseFilter, flagFilter, sortCol, sortDir]);

  // Add note to patient
  const handleAddNote = (id) => {
    const patient = mockPatients.find((p) => p.id === id);
    if (patient && noteInput.trim()) {
      patient.notes.push({
        text: noteInput,
        timestamp: new Date().toISOString().slice(0, 16).replace("T", " "),
      });
      setNoteInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-6xl bg-white rounded-lg shadow-lg p-8">
        <DashboardHeader onLogout={handleLogout} />
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
        />
        {expanded && (
          <PatientModal
            patient={mockPatients.find((x) => x.id === expanded)}
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
