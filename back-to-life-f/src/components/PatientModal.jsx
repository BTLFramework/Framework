import { format } from "date-fns";

function PatientModal({
  patient,
  onClose,
  getPhase,
  needsFollowUp,
  noteInput,
  setNoteInput,
  handleAddNote,
}) {
  if (!patient) return null;
  const phaseColor =
    getPhase(patient.srs) === "RESET"
      ? "bg-blue-100 text-blue-800"
      : getPhase(patient.srs) === "EDUCATE"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"></div>
      <div className="relative bg-white bg-opacity-95 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-lg border border-blue-100">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-700 text-2xl"
          onClick={onClose}
        >
          ×
        </button>
        <h3 className="text-2xl font-bold mb-2 text-blue-900">
          {patient.name}
        </h3>
        <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
          <div>
            <span className="font-semibold">Intake:</span>{" "}
            {format(new Date(patient.intakeDate), "yyyy-MM-dd")}
          </div>
          <div>
            <span className="font-semibold">Last Update:</span>{" "}
            {format(new Date(patient.lastUpdate), "yyyy-MM-dd")}
            {needsFollowUp(patient.lastUpdate) && (
              <span className="ml-2 px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">
                Needs Follow-up
              </span>
            )}
          </div>
        </div>
        <div className="mb-2">
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${phaseColor}`}
          >
            {getPhase(patient.srs)}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div>
            <span className="font-semibold">Belief Status:</span>{" "}
            {patient.beliefStatus}
          </div>
          <div>
            <span className="font-semibold">Disability Index:</span>{" "}
            {patient.disabilityIndex}%
          </div>
        </div>
        <div className="mb-4">
          <span className="font-semibold">PSFS Activities:</span>
          <ul className="list-disc ml-6 mt-1">
            {patient.psfs.map((a, i) => (
              <li key={i}>
                {a.activity}: <span className="font-mono">{a.score}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mb-2">
          <span className="font-semibold">Clinician Notes:</span>
          <ul className="list-disc ml-6 mb-2 mt-1">
            {patient.notes.map((n, i) => (
              <li key={i}>
                <span className="font-mono">{n.timestamp}</span>: {n.text}
              </li>
            ))}
            {patient.notes.length === 0 && (
              <li className="text-gray-400">No notes yet.</li>
            )}
          </ul>
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              className="border border-blue-200 px-2 py-1 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
              placeholder="Add note"
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
            />
            <button
              className="bg-blue-600 text-white px-4 py-1 rounded-lg hover:bg-blue-700"
              onClick={() => {
                handleAddNote(patient.id);
              }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientModal;
