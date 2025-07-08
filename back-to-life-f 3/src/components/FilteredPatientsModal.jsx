import React, { useState, useMemo } from "react";
import PatientTable from "./PatientTable";
import PatientModal from "./PatientModal";

export default function FilteredPatientsModal({ 
  isOpen, 
  onClose, 
  filterType, 
  patients, 
  isFlagged, 
  needsFollowUp,
  onDeletePatients 
}) {
  const [expanded, setExpanded] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [selectedPatients, setSelectedPatients] = useState([]);

  // Filter patients based on type
  const filteredPatients = useMemo(() => {
    switch (filterType) {
      case 'attention':
        return patients.filter(p => {
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
        });
      
      case 'followup':
        return patients.filter(p => needsFollowUp(p.lastUpdate));
      
      case 'low_engagement':
        return patients.filter(p => 
          p.recoveryPoints && p.recoveryPoints.completionRate < 50
        );
      
      default:
        return patients;
    }
  }, [patients, filterType, needsFollowUp]);

  const getModalTitle = () => {
    switch (filterType) {
      case 'attention':
        return `Patients Needing Attention (${filteredPatients.length})`;
      case 'followup':
        return `Follow-up Due (${filteredPatients.length})`;
      case 'low_engagement':
        return `Low Engagement (${filteredPatients.length})`;
      default:
        return `Filtered Patients (${filteredPatients.length})`;
    }
  };

  const handleAddNote = (id) => {
    if (!noteInput.trim()) return;
    
    // In a real app, this would make an API call to save the note
    console.log(`Adding note to patient ${id}: ${noteInput}`);
    setNoteInput("");
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        {/* Modal Content */}
        <div 
          style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            width: '95%',
            maxWidth: '1400px',
            maxHeight: '90vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            display: 'flex',
            flexDirection: 'column'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #e5e7eb',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#f8fafc'
          }}>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1f2937'
              }}>
                {getModalTitle()}
              </h2>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '0.875rem',
                color: '#6b7280'
              }}>
                {filterType === 'attention' && 'Patients requiring immediate clinical attention'}
                {filterType === 'followup' && 'Patients overdue for follow-up appointments'}
                {filterType === 'low_engagement' && 'Patients with low portal engagement'}
              </p>
            </div>
            
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f3f4f6';
                e.target.style.color = '#374151';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6b7280';
              }}
            >
              ✕
            </button>
          </div>

          {/* Modal Body - Patient Table */}
          <div style={{
            flex: 1,
            overflow: 'auto',
            padding: '0'
          }}>
            {filteredPatients.length === 0 ? (
              <div style={{
                padding: '64px 32px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📋</div>
                <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No patients found</h3>
                <p style={{ margin: 0 }}>
                  {filterType === 'attention' && 'No patients currently need attention'}
                  {filterType === 'followup' && 'No patients have overdue follow-ups'}
                  {filterType === 'low_engagement' && 'No patients have low engagement'}
                </p>
              </div>
            ) : (
              <PatientTable
                patients={filteredPatients}
                search=""
                setSearch={() => {}} // Disable search in modal
                phaseFilter=""
                setPhaseFilter={() => {}} // Disable phase filter in modal
                flagFilter=""
                setFlagFilter={() => {}} // Disable flag filter in modal
                sortCol="intakeDate"
                setSortCol={() => {}} // You can enable sorting if needed
                sortDir="desc"
                setSortDir={() => {}}
                onRowClick={(patientId) => {
                  console.log('🎯 Modal patient clicked:', patientId);
                  setExpanded(patientId);
                }}
                isFlagged={isFlagged}
                needsFollowUp={needsFollowUp}
                selectedPatients={selectedPatients}
                setSelectedPatients={setSelectedPatients}
                onDeletePatients={onDeletePatients}
                customFilter={null}
                onClearFilter={() => {}}
                isModal={true} // Flag to indicate this is in a modal
              />
            )}
          </div>
        </div>
      </div>

      {/* Patient Detail Modal (nested modal) */}
      {expanded && (
        <PatientModal
          patient={filteredPatients.find((p) => p.id === expanded)}
          onClose={() => setExpanded(null)}
          needsFollowUp={needsFollowUp}
          noteInput={noteInput}
          setNoteInput={setNoteInput}
          handleAddNote={handleAddNote}
        />
      )}
    </>
  );
} 