function PatientModal({ patient, onClose }) {
  if (!patient) return null;

  return (
    <div style={{
      position: "fixed",
      inset: "0",
      zIndex: "50",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)"
    }}>
      <div style={{
        background: "white",
        borderRadius: "1rem",
        padding: "2rem",
        maxWidth: "30rem",
        width: "90%"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <h2>Patient: {patient.name}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.5rem" }}>×</button>
        </div>
        
        <div>
          <p><strong>SRS Score:</strong> {patient.srsScore}</p>
          <p><strong>Email:</strong> {patient.email}</p>
          <p><strong>Intake Date:</strong> {patient.intakeDate}</p>
        </div>
      </div>
    </div>
  );
}

export default PatientModal; 