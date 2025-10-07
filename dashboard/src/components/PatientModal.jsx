import { useState } from "react";
import { API_URL } from "../config/api";

// Helper function to get disability color based on region and score
const getDisabilityColor = (region, score) => {
  const regionLower = region?.toLowerCase();
  
  // NDI (Neck Disability Index) - 0-4% (No), 5-14% (Mild), 15-24% (Moderate), 25-34% (Severe), 35-50% (Complete)
  if (regionLower === 'neck') {
    if (score <= 4) return '#155e75'; // Dark blue - No disability
    if (score <= 14) return '#0891b2'; // Medium blue - Mild
    if (score <= 24) return '#06b6d4'; // Light blue - Moderate
    if (score <= 34) return '#e0f2fe'; // Very light blue - Severe
    return '#f0f9ff'; // Lightest blue - Complete
  }
  
  // ODI (Oswestry Disability Index) - 0-20% (Minimal), 21-40% (Moderate), 41-60% (Severe), 61-80% (Crippling), 81-100% (Bed-bound)
  if (regionLower === 'low back' || regionLower === 'low back / si joint') {
    if (score <= 20) return '#155e75'; // Dark blue - Minimal
    if (score <= 40) return '#0891b2'; // Medium blue - Moderate
    if (score <= 60) return '#06b6d4'; // Light blue - Severe
    if (score <= 80) return '#e0f2fe'; // Very light blue - Crippling
    return '#f0f9ff'; // Lightest blue - Bed-bound
  }
  
  // TDI (Thoracic Disability Index) - 0-40% (Minimal), 41-60% (Moderate), 61-80% (Severe), 81-100% (Complete)
  if (regionLower === 'mid-back / thoracic' || regionLower === 'thoracic') {
    if (score <= 40) return '#155e75'; // Dark blue - Minimal
    if (score <= 60) return '#0891b2'; // Medium blue - Moderate
    if (score <= 80) return '#06b6d4'; // Light blue - Severe
    return '#e0f2fe'; // Very light blue - Complete
  }
  
  // ULFI and LEFS have different scoring systems - use generic thresholds for now
  if (regionLower?.includes('upper limb') || regionLower?.includes('lower limb')) {
    if (score <= 20) return '#155e75'; // Dark blue - Low
    if (score <= 40) return '#0891b2'; // Medium blue - Moderate
    return '#06b6d4'; // Light blue - High
  }
  
  // Default fallback
  if (score <= 20) return '#155e75';
  if (score <= 40) return '#0891b2';
  return '#06b6d4';
};

// Helper function to get disability severity label based on region and score
const getDisabilityLabel = (region, score) => {
  const regionLower = region?.toLowerCase();
  
  // NDI (Neck Disability Index) - 0-4% (No), 5-14% (Mild), 15-24% (Moderate), 25-34% (Severe), 35-50% (Complete)
  if (regionLower === 'neck') {
    if (score <= 4) return 'No Disability';
    if (score <= 14) return 'Mild';
    if (score <= 24) return 'Moderate';
    if (score <= 34) return 'Severe';
    return 'Complete';
  }
  
  // ODI (Oswestry Disability Index) - 0-20% (Minimal), 21-40% (Moderate), 41-60% (Severe), 61-80% (Crippling), 81-100% (Bed-bound)
  if (regionLower === 'low back' || regionLower === 'low back / si joint') {
    if (score <= 20) return 'Minimal';
    if (score <= 40) return 'Moderate';
    if (score <= 60) return 'Severe';
    if (score <= 80) return 'Crippling';
    return 'Bed-bound';
  }
  
  // TDI (Thoracic Disability Index) - 0-40% (Minimal), 41-60% (Moderate), 61-80% (Severe), 81-100% (Complete)
  if (regionLower === 'mid-back / thoracic' || regionLower === 'thoracic') {
    if (score <= 40) return 'Minimal';
    if (score <= 60) return 'Moderate';
    if (score <= 80) return 'Severe';
    return 'Complete';
  }
  
  // ULFI and LEFS have different scoring systems - use generic labels for now
  if (regionLower?.includes('upper limb') || regionLower?.includes('lower limb')) {
    if (score <= 20) return 'Low';
    if (score <= 40) return 'Moderate';
    return 'High';
  }
  
  // Default fallback
  if (score <= 20) return 'Minimal';
  if (score <= 40) return 'Moderate';
  return 'Severe';
};

// Helper functions for PCS-4 (Pain Catastrophizing Scale)
const calculatePCS4Score = (pcs4) => {
  if (!pcs4) return 0;
  return Object.values(pcs4).reduce((sum, score) => sum + (score || 0), 0);
};

const getPCS4Color = (pcs4) => {
  const score = calculatePCS4Score(pcs4);
  if (score <= 6) return '#155e75'; // Dark blue - Low catastrophizing
  if (score <= 12) return '#0891b2'; // Medium blue - Moderate catastrophizing
  return '#06b6d4'; // Light blue - High catastrophizing
};

const getPCS4Label = (score) => {
  if (score <= 6) return 'Low Catastrophizing';
  if (score <= 12) return 'Moderate Catastrophizing';
  return 'High Catastrophizing';
};

// Helper functions for TSK-7 (Modified Fear-Avoidance Screener)
const calculateTSK7Score = (tsk7) => {
  if (!tsk7) return 0;
  let totalScore = 0;
  let validResponses = 0;
  
  // TSK-7 items with reverse-scored items (2, 6, 7)
  for (let i = 1; i <= 7; i++) {
    const response = tsk7[i];
    if (response !== undefined && response >= 0 && response <= 4) {
      let itemScore = response;
      
      // Reverse score items 2, 6, 7 (0→4, 1→3, 2→2, 3→1, 4→0)
      if (i === 2 || i === 6 || i === 7) {
        itemScore = 4 - response;
      }
      
      totalScore += itemScore;
      validResponses++;
    }
  }
  
  return validResponses === 7 ? totalScore : 0;
};

const getTSK7Color = (tsk7) => {
  const score = calculateTSK7Score(tsk7);
  const fearScore = (score / 28) * 100; // Normalize to percentage
  if (fearScore <= 30) return '#155e75'; // Dark blue - Low fear-avoidance
  if (fearScore <= 50) return '#0891b2'; // Medium blue - Moderate fear-avoidance
  return '#06b6d4'; // Light blue - High fear-avoidance
};

const getTSK7Label = (score) => {
  const fearScore = (score / 28) * 100; // Normalize to percentage
  if (fearScore <= 30) return 'Low Fear-Avoidance';
  if (fearScore <= 50) return 'Moderate Fear-Avoidance';
  return 'High Fear-Avoidance';
};

function PatientModal({ patient, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  
  // Practitioner Assessment State
  const [practitionerAssessment, setPractitionerAssessment] = useState({
    // Section 1: Symptom & Key Finding Resolution
    neurological: { selected: false, score: '0', notes: '' },
    mechanical: { selected: false, score: '0', notes: '' },
    orthopedic: { selected: false, score: '0', notes: '' },
    provocative: { selected: false, score: '0', notes: '' },
    
    // Section 2: Functional & Mechanical Progress
    rom: { selected: false, score: '0', notes: '' },
    functional: { selected: false, score: '0', notes: '' },
    movement: { selected: false, score: '0', notes: '' },
    strength: { selected: false, score: '0', notes: '' },
    balance: { selected: false, score: '0', notes: '' },
    stability: { selected: false, score: '0', notes: '' },
    treatment: { selected: false, score: '0', notes: '' }
  });

  // Clinician Assessment State
  const [clinicianAssessment, setClinicianAssessment] = useState({
    recoveryMilestone: false,
    clinicalProgressVerified: false
  });

  // Quick Actions State
  const [quickActions, setQuickActions] = useState({
    reassessmentScheduled: false,
    treatmentPlanUpdated: false,
    reviewed: false
  });

  // Clinical Notes State
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [newNoteType, setNewNoteType] = useState('general');

  if (!patient) {
    return null;
  }

  // Get the latest SRS score data from patient object
  const srsScore = patient.srs || 0;
  const phase = patient.phase || 'UNKNOWN';
  
  // Debug log to see what TSK data is available
  console.log('🔍 PatientModal TSK Debug:', { 
    patientName: patient.name, 
    tsk7: patient.tsk7,
    hasTsk7: !!patient.tsk7,
    tsk7Type: typeof patient.tsk7
  });

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Calculate days since intake
  const daysSinceIntake = patient.intakeDate 
    ? Math.floor((new Date() - new Date(patient.intakeDate)) / (1000 * 60 * 60 * 24))
    : 0;

  // PSFS activities
  const psfsActivities = patient.psfs || [];

  // Beliefs
  const beliefs = patient.beliefs || [];
  
  // Practitioner Assessment Handlers
  const handlePractitionerAssessmentChange = (category, field, value) => {
    setPractitionerAssessment(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };
  
  const calculateSection1Score = () => {
    const selectedItems = Object.values(practitionerAssessment)
      .filter(item => item.selected && ['neurological', 'mechanical', 'orthopedic', 'provocative'].includes(Object.keys(practitionerAssessment).find(key => practitionerAssessment[key] === item)))
      .map(item => parseFloat(item.score));
    
    if (selectedItems.length === 0) return 0;
    return Math.min(1, selectedItems.reduce((sum, score) => sum + score, 0) / selectedItems.length);
  };
  
  const calculateSection2Score = () => {
    const selectedItems = Object.values(practitionerAssessment)
      .filter(item => item.selected && ['rom', 'functional', 'movement', 'strength', 'balance', 'stability', 'treatment'].includes(Object.keys(practitionerAssessment).find(key => practitionerAssessment[key] === item)))
      .map(item => parseFloat(item.score));
    
    if (selectedItems.length === 0) return 0;
    return Math.min(1, selectedItems.reduce((sum, score) => sum + score, 0) / selectedItems.length);
  };
  
  const calculateTotalPractitionerScore = () => {
    const section1Score = calculateSection1Score();
    const section2Score = calculateSection2Score();
    return Math.round((section1Score + section2Score) * 10) / 10;
  };
  
  const handleSavePractitionerAssessment = async () => {
    try {
      const assessmentData = {
        patientId: patient.id,
        ...practitionerAssessment,
        clinicianId: 'clinician-001', // TODO: Get from auth context
        clinicianName: 'Dr. Practitioner' // TODO: Get from auth context
      };

      const response = await fetch(`${API_URL}/patients/${patient.id}/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Assessment saved successfully:', result);
        alert('Practitioner assessment saved successfully!');
        
        // TODO: Refresh patient data to show updated SRS score
        // This would typically trigger a refresh of the patient list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save assessment');
      }
    } catch (error) {
      console.error('Error saving practitioner assessment:', error);
      alert(`Failed to save assessment: ${error.message}`);
    }
  };

  // Clinician Assessment Handlers
  const handleClinicianAssessmentChange = (field, value) => {
    setClinicianAssessment(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveClinicianAssessment = async () => {
    try {
      const assessmentData = {
        patientId: patient.id,
        ...clinicianAssessment,
        clinicianId: 'clinician-001', // TODO: Get from auth context
        clinicianName: 'Dr. Practitioner' // TODO: Get from auth context
      };

      const response = await fetch(`${API_URL}/patients/${patient.id}/assessment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(assessmentData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Clinician assessment saved successfully:', result);
        alert('Clinician assessment saved successfully!');
        
        // TODO: Refresh patient data to show updated SRS score
        // This would typically trigger a refresh of the patient list
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save assessment');
      }
    } catch (error) {
      console.error('Error saving clinician assessment:', error);
      alert(`Failed to save assessment: ${error.message}`);
    }
  };

  // Quick Actions Handlers
  const handleScheduleReassessment = async () => {
    try {
      // Pick date (default +7d)
      const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      const dateInput = window.prompt('Enter reassessment date (YYYY-MM-DD):', defaultDate);
      if (!dateInput) return;
      const scheduledAt = new Date(dateInput);
      if (Number.isNaN(scheduledAt.getTime())) {
        alert('Invalid date. Please use YYYY-MM-DD.');
        return;
      }

      const sendReminder = window.confirm('Send a patient reminder ~48h before the reassessment?');

      const response = await fetch(`${API_URL}/patients/${patient.id}/reassessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduledAt: scheduledAt.toISOString() })
      });

      if (response.ok) {
        setQuickActions(prev => ({ ...prev, reassessmentScheduled: true }));
        const scheduledStr = scheduledAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        alert(`Reassessment scheduled for ${scheduledStr}`);

        // Auto clinical note
        try {
          await fetch(`${API_URL}/patients/${patient.id}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: `Reassessment scheduled for ${scheduledStr}. Reminder: ${sendReminder ? 'YES' : 'NO'}`, authorId: null })
          });
        } catch (e) {
          console.warn('Failed to create clinical note for reassessment:', e);
        }

        // Send immediate reminder if within 48h
        if (sendReminder) {
          const msUntil = scheduledAt.getTime() - Date.now();
          if (msUntil <= 48 * 60 * 60 * 1000) {
            try {
              const msg = `Hi ${patient.name},\n\nThis is a reminder for your reassessment around ${scheduledStr}. Please log in to your patient portal to confirm or message us if you need to adjust.\n\n– Back to Life Team`;
              await fetch(`${API_URL}/api/messages/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ patientId: patient.id, subject: 'Reassessment Reminder', content: msg, senderName: 'Clinician', senderEmail: 'clinician@backtolife.ca' })
              });
            } catch (e) {
              console.warn('Failed to send immediate reassessment reminder:', e);
            }
          }
        }
      } else {
        throw new Error('Failed to schedule reassessment');
      }
    } catch (error) {
      console.error('Error scheduling reassessment:', error);
      alert(`Failed to schedule reassessment: ${error.message}`);
    }
  };

  const handleUpdateTreatmentPlan = async () => {
    try {
      // Prompt clinician for summary and exercise IDs (comma-separated)
      const summary = window.prompt('Treatment plan summary (e.g., Biceps tendinopathy progression focus):',
        `Plan based on SRS ${srsScore}/11 and ${phase} phase`);
      if (summary === null) return;
      const idsRaw = window.prompt('Enter exercise IDs (comma-separated). Leave blank to only update summary:', '');
      const ids = idsRaw ? idsRaw.split(',').map(s => s.trim()).filter(Boolean) : [];

      const response = await fetch(`${API_URL}/patients/${patient.id}/treatment-plan`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: summary || '', exercises: ids })
      });

      if (response.ok) {
        setQuickActions(prev => ({ ...prev, treatmentPlanUpdated: true }));
        alert('Treatment plan updated. Manual exercises will override auto-selection.');
        // Create clinical note
        try {
          await fetch(`${API_URL}/patients/${patient.id}/notes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: `Treatment plan updated. Assigned exercises: ${ids.join(', ') || 'none'}. Summary: ${summary}`, authorId: null })
          });
        } catch (_) {}
      } else {
        throw new Error('Failed to update treatment plan');
      }
    } catch (error) {
      console.error('Error updating treatment plan:', error);
      alert(`Failed to update treatment plan: ${error.message}`);
    }
  };

  const handleMarkAsReviewed = async () => {
    try {
      const reviewData = {
        patientId: patient.id,
        reviewedAt: new Date().toISOString(),
        reviewedBy: 'clinician-001',
        reviewerName: 'Dr. Practitioner',
        reviewType: 'clinical_review'
      };

      const response = await fetch(`${API_URL}/patients/${patient.id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      });

      if (response.ok) {
        setQuickActions(prev => ({ ...prev, reviewed: true }));
        alert('Patient marked as reviewed successfully!');
      } else {
        throw new Error('Failed to mark patient as reviewed');
      }
    } catch (error) {
      console.error('Error marking patient as reviewed:', error);
      alert(`Failed to mark patient as reviewed: ${error.message}`);
    }
  };

  // Clinical Notes Handlers
  const handleAddNote = async () => {
    if (!newNoteText.trim()) {
      alert('Please enter a note before saving.');
      return;
    }

    try {
      const noteData = {
        patientId: patient.id,
        text: newNoteText.trim(),
        type: newNoteType,
        createdAt: new Date().toISOString(),
        clinicianId: 'clinician-001',
        clinicianName: 'Dr. Practitioner'
      };

      const response = await fetch(`${API_URL}/patients/${patient.id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: noteData.text, authorId: null })
      });

      if (response.ok) {
        const result = await response.json();
        const newNote = {
          id: result.noteId || Date.now(),
          text: newNoteText.trim(),
          type: newNoteType,
          createdAt: new Date().toISOString(),
          clinicianName: 'Dr. Practitioner'
        };
        
        setClinicalNotes(prev => [newNote, ...prev]);
        setNewNoteText('');
        setNewNoteType('general');
        setShowAddNoteModal(false);
        alert('Clinical note added successfully!');
      } else {
        throw new Error('Failed to add clinical note');
      }
    } catch (error) {
      console.error('Error adding clinical note:', error);
      alert(`Failed to add clinical note: ${error.message}`);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/patients/${patient.id}/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setClinicalNotes(prev => prev.filter(note => note.id !== noteId));
        alert('Note deleted successfully!');
      } else {
        throw new Error('Failed to delete note');
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert(`Failed to delete note: ${error.message}`);
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '20px'
      }}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Header */}
        <div 
          style={{
            background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
            color: 'white',
            padding: '24px',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '8px', margin: 0 }}>
                {patient.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.9rem', opacity: 0.9 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Email: {patient.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  Intake: {formatDate(patient.intakeDate)} ({daysSinceIntake} days ago)
                </span>
              </div>
            </div>
            <button 
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px',
                color: 'white',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background 0.2s ease'
              }}
              onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ borderBottom: '1px solid #e5e7eb' }}>
          <nav style={{ display: 'flex', padding: '0 24px' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'assessments', label: 'Assessments' },
              { id: 'notes', label: 'Notes' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '12px 16px',
                  borderBottom: activeTab === tab.id ? '2px solid #155e75' : '2px solid transparent',
                  fontSize: '0.875rem',
                  fontWeight: activeTab === tab.id ? 600 : 500,
                  color: activeTab === tab.id ? '#155e75' : '#6b7280',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div 
          style={{ 
            padding: '24px', 
            overflowY: 'auto', 
            maxHeight: '60vh',
            flex: 1
          }}
        >
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* SRS Score Section */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e0f2fe'
                }}
              >
                <h3 
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    color: '#155e75',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    margin: 0
                  }}
                >
                  <span>Signature Recovery Score™</span>
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#155e75' }}>
                    {srsScore}/11
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backgroundColor: srsScore >= 8 ? '#155e75' : srsScore >= 5 ? '#0891b2' : '#06b6d4',
                        color: 'white'
                      }}
                    >
                      {phase} Phase
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px', margin: 0 }}>Current Phase</p>
                  </div>
                </div>
              </div>

              {/* Key Metrics Grid - Compact */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', 
                  gap: '12px' 
                }}
              >
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #155e75',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: (patient.painScore || 0) >= 8 ? '#155e75' : (patient.painScore || 0) >= 6 ? '#0891b2' : (patient.painScore || 0) >= 4 ? '#06b6d4' : '#e0f2fe',
                    marginBottom: '6px'
                  }}>
                    {patient.painScore || 'N/A'}/10
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>Pain Level</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 6px',
                    borderRadius: '10px',
                    backgroundColor: (patient.painScore || 0) >= 8 ? '#155e75' : (patient.painScore || 0) >= 6 ? '#0891b2' : (patient.painScore || 0) >= 4 ? '#06b6d4' : '#e0f2fe',
                    color: 'white',
                    fontWeight: 600
                  }}>
                    {(patient.painScore || 0) >= 8 ? 'Excellent' : (patient.painScore || 0) >= 6 ? 'Good' : (patient.painScore || 0) >= 4 ? 'Fair' : 'Needs Attention'}
                  </div>
                </div>

                <div 
                  style={{
                    background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #155e75',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: (patient.confidence || 0) >= 8 ? '#155e75' : (patient.confidence || 0) >= 6 ? '#0891b2' : (patient.confidence || 0) >= 4 ? '#06b6d4' : '#e0f2fe',
                    marginBottom: '6px'
                  }}>
                    {patient.confidence || 'N/A'}/10
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>Confidence</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 6px',
                    borderRadius: '10px',
                    backgroundColor: (patient.confidence || 0) >= 8 ? '#155e75' : (patient.confidence || 0) >= 6 ? '#0891b2' : (patient.confidence || 0) >= 4 ? '#06b6d4' : '#e0f2fe',
                    color: 'white',
                    fontWeight: 600
                  }}>
                    {(patient.confidence || 0) >= 8 ? 'Excellent' : (patient.confidence || 0) >= 6 ? 'Good' : (patient.confidence || 0) >= 4 ? 'Fair' : 'Needs Attention'}
                  </div>
                </div>

                <div 
                  style={{
                    background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #155e75',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: getDisabilityColor(patient.region, (patient.disabilityIndex || patient.disabilityPercentage || 0)),
                    marginBottom: '6px'
                  }}>
                    {patient.disabilityIndex || patient.disabilityPercentage || 0}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>Disability</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 6px',
                    borderRadius: '10px',
                    backgroundColor: getDisabilityColor(patient.region, (patient.disabilityIndex || patient.disabilityPercentage || 0)),
                    color: 'white',
                    fontWeight: 600
                  }}>
                    {getDisabilityLabel(patient.region, (patient.disabilityIndex || patient.disabilityPercentage || 0))}
                  </div>
                </div>

                <div 
                  style={{
                    background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid #155e75',
                    textAlign: 'center',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: '#155e75',
                    marginBottom: '6px'
                  }}>
                    {patient.region || 'N/A'}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>Primary Region</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 6px',
                    borderRadius: '10px',
                    backgroundColor: '#67e8f9',
                    color: '#155e75',
                    fontWeight: 600
                  }}>
                    Treatment Focus
                  </div>
                </div>
              </div>

              {/* Patient Information */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '20px' 
                }}
              >
                <div 
                  style={{ 
                    background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: '1px solid #67e8f9',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    color: '#155e75', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>Patient Engagement</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #67e8f9'
                      }}
                    >
                      <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>Status</span>
                      <span style={{ 
                        fontWeight: 600, 
                        color: 'white', 
                        fontSize: '0.875rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: (patient.engagement || 'Active').toLowerCase() === 'active' ? '#059669' : '#dc2626'
                      }}>
                        {patient.engagement || 'Active'}
                      </span>
                    </div>
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #67e8f9'
                      }}
                    >
                      <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>Weekly Points</span>
                      <span style={{ 
                        fontWeight: 600, 
                        color: '#155e75', 
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <span>{patient.recoveryPoints?.weeklyPoints || 0}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div 
                  style={{ 
                    background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)', 
                    padding: '20px', 
                    borderRadius: '12px', 
                    border: '1px solid #67e8f9',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                  }}
                >
                  <h4 style={{ 
                    fontSize: '1rem', 
                    fontWeight: 600, 
                    color: '#155e75', 
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <span>Clinical Timeline</span>
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #67e8f9'
                      }}
                    >
                      <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>Intake Date</span>
                      <span style={{ fontWeight: 600, color: '#155e75', fontSize: '0.875rem' }}>
                        {formatDate(patient.intakeDate)}
                      </span>
                    </div>
                    <div 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '12px',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #67e8f9'
                      }}
                    >
                      <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>Last Update</span>
                      <span style={{ fontWeight: 600, color: '#6b7280', fontSize: '0.875rem' }}>
                        {formatDate(patient.updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#155e75', margin: 0 }}>
                  Assessment Data
                </h3>
                <div style={{ fontSize: '0.7rem', color: '#6b7280' }}>
                  {formatDate(patient.intakeDate)}
                </div>
              </div>

              {/* Ultra Compact Overview */}
              <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem' }}><strong>Region:</strong> {patient.region || 'N/A'}</span>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#155e75' }}>
                    {srsScore}/11
                  </div>
                  <span style={{ 
                    fontSize: '0.75rem',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    <strong>Reviewed:</strong> No
                  </span>
                </div>
              </div>

              {/* Assessment Scores - Single Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '8px' }}>
                {/* VAS */}
                <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>VAS Pain</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 'bold', 
                      color: (patient.painScore || 0) >= 7 ? '#dc2626' : (patient.painScore || 0) >= 4 ? '#d97706' : '#059669'
                    }}>
                      {patient.painScore || 'N/A'}/10
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(patient.painScore || 0) * 10}%`, 
                      height: '100%', 
                      backgroundColor: (patient.painScore || 0) >= 7 ? '#dc2626' : (patient.painScore || 0) >= 4 ? '#d97706' : '#059669'
                    }}></div>
                  </div>
                </div>

                {/* Confidence */}
                <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>Confidence</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: 'bold', 
                      color: (patient.confidence || 0) >= 7 ? '#059669' : (patient.confidence || 0) >= 4 ? '#d97706' : '#dc2626'
                    }}>
                      {patient.confidence || 'N/A'}/10
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(patient.confidence || 0) * 10}%`, 
                      height: '100%', 
                      backgroundColor: (patient.confidence || 0) >= 7 ? '#059669' : (patient.confidence || 0) >= 4 ? '#d97706' : '#dc2626'
                    }}></div>
                  </div>
                </div>

                {/* Disability Index - Region Specific */}
                {(patient.region === 'Neck' || patient.region === 'Mid-Back / Thoracic' || patient.region === 'Low Back' || patient.region === 'Upper Limb' || patient.region === 'Lower Limb') && (
                  <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>
                      {patient.region === 'Neck' ? 'NDI' : 
                       patient.region === 'Mid-Back / Thoracic' ? 'TDI' :
                       patient.region === 'Low Back' ? 'ODI' :
                       patient.region === 'Upper Limb' ? 'ULFI' :
                       patient.region === 'Lower Limb' ? 'LEFS' : 'Disability Index'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 'bold', 
                        color: getDisabilityColor(patient.region, (patient.disabilityIndex || patient.disabilityPercentage || 0))
                      }}>
                        {(patient.disabilityIndex || patient.disabilityPercentage || 0)}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${(patient.disabilityIndex || patient.disabilityPercentage || 0)}%`, 
                        height: '100%', 
                        backgroundColor: getDisabilityColor(patient.region, (patient.disabilityIndex || patient.disabilityPercentage || 0))
                      }}></div>
                    </div>
                  </div>
                )}

                                {/* Pain Beliefs (PCS-4) */}
                {patient.pcs4 && (
                  <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>Pain Beliefs (PCS-4)</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: getPCS4Color(patient.pcs4) }}>
                      {calculatePCS4Score(patient.pcs4)}/20
                    </div>
                    <div style={{ fontSize: '0.6rem', color: '#6b7280', marginTop: '2px' }}>
                      {getPCS4Label(calculatePCS4Score(patient.pcs4))}
                    </div>
                  </div>
                )}

                        {/* Fear of Movement (TSK-7) */}
        {patient.tsk7 ? (
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>Fear of Movement (TSK-7)</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: getTSK7Color(patient.tsk7) }}>
              {calculateTSK7Score(patient.tsk7)}/28
            </div>
            <div style={{ fontSize: '0.6rem', color: '#6b7280', marginTop: '2px' }}>
              {getTSK7Label(calculateTSK7Score(patient.tsk7))}
            </div>
          </div>
        ) : (
          <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>Fear of Movement (TSK-7)</div>
            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: '#6b7280' }}>
              No Data
            </div>
            <div style={{ fontSize: '0.6rem', color: '#6b7280', marginTop: '2px' }}>
              Assessment not completed
            </div>
          </div>
        )}
              </div>

              {/* PSFS - Compact */}
              <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px', margin: 0 }}>
                  PSFS Activities
                </h4>
                
                {psfsActivities && psfsActivities.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {psfsActivities.map((activity, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px', backgroundColor: '#f9fafb', borderRadius: '4px' }}>
                        <span style={{ fontSize: '0.7rem', color: '#374151', flex: 1 }}>
                          {activity.activity}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 'bold', 
                            color: activity.score >= 8 ? '#155e75' : activity.score >= 6 ? '#0891b2' : '#06b6d4',
                            minWidth: '32px'
                          }}>
                            {activity.score}/10
                          </span>
                          <div style={{ width: '40px', height: '3px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${activity.score * 10}%`, 
                              height: '100%', 
                              backgroundColor: activity.score >= 8 ? '#155e75' : activity.score >= 6 ? '#0891b2' : '#06b6d4'
                            }}></div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    <div style={{ background: '#155e75', padding: '4px 6px', borderRadius: '4px', color: 'white', fontSize: '0.7rem', marginTop: '2px' }}>
                      <strong>Average: {(psfsActivities.reduce((sum, act) => sum + act.score, 0) / psfsActivities.length).toFixed(1)}/10</strong>
                    </div>
                  </div>
                ) : (
                  <div style={{ padding: '6px', backgroundColor: '#f9fafb', borderRadius: '4px', color: '#6b7280', fontSize: '0.7rem' }}>
                    No PSFS activities recorded
                  </div>
                )}
              </div>


            </div>
          )}

          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#155e75', margin: 0 }}>
                  Clinical Notes & Flags
                </h3>
                <button 
                  onClick={() => setShowAddNoteModal(true)}
                  style={{
                    padding: '10px 16px',
                    background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Add Note
                </button>
              </div>
              
              {/* Clinical Flags */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #fef2f2 0%, #ffffff 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #fecaca'
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#991b1b', marginBottom: '16px', margin: 0 }}>
                  Clinical Flags
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {daysSinceIntake > 28 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#dc2626', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#991b1b' }}>
                        Patient overdue for follow-up assessment ({daysSinceIntake} days)
                      </span>
                    </div>
                  )}
                  {(patient.painScore || 0) >= 7 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#dc2626', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#991b1b' }}>
                        High pain levels reported (VAS: {patient.painScore}/10)
                      </span>
                    </div>
                  )}
                  {(patient.confidence || 0) <= 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#d97706', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#92400e' }}>
                        Low confidence in recovery ({patient.confidence}/10)
                      </span>
                    </div>
                  )}
                  {beliefs.length > 0 && beliefs.some(b => !b.includes('None')) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#d97706', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#92400e' }}>
                        Negative beliefs about movement identified
                      </span>
                    </div>
                  )}
                  {daysSinceIntake <= 28 && (patient.painScore || 0) < 7 && (patient.confidence || 0) > 3 && (!beliefs.length || beliefs.every(b => b.includes('None'))) && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#059669', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#065f46' }}>
                        No clinical flags at this time
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Progress Summary */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #f0fdff 0%, #ffffff 100%)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #67e8f9'
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#155e75', marginBottom: '16px', margin: 0 }}>
                  Progress Summary
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#155e75' }}>
                      {daysSinceIntake}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Days in Program</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#155e75' }}>
                      {phase}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Current Phase</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#155e75' }}>
                      {srsScore}/11
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Recovery Score</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#d97706' }}>
                      No
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Clinician Reviewed</div>
                  </div>
                </div>
              </div>

              {/* SRS Clinician Assessment */}
              <div 
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#155e75', marginBottom: '16px', margin: 0 }}>
                  SRS Clinician Assessment
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Recovery Milestone */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={clinicianAssessment.recoveryMilestone}
                      onChange={(e) => handleClinicianAssessmentChange('recoveryMilestone', e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#155e75'
                      }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Recovery Milestone Achieved
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#059669', 
                      backgroundColor: '#f0fdf4',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #bbf7d0'
                    }}>
                      +1 SRS Point
                    </span>
                  </label>

                  {/* Clinical Progress Verified */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={clinicianAssessment.clinicalProgressVerified}
                      onChange={(e) => handleClinicianAssessmentChange('clinicalProgressVerified', e.target.checked)}
                      style={{
                        width: '16px',
                        height: '16px',
                        accentColor: '#155e75'
                      }}
                    />
                    <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                      Clinical Progress Verified
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: '#059669', 
                      backgroundColor: '#f0fdf4',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid #bbf7d0'
                    }}>
                      +1 SRS Point
                    </span>
                  </label>
                </div>

                {/* Save Button */}
                <div style={{ marginTop: '16px', textAlign: 'center' }}>
                  <button
                    onClick={handleSaveClinicianAssessment}
                    style={{
                      padding: '8px 16px',
                      background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-1px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                  >
                    Save Clinician Assessment
                  </button>
                </div>
              </div>

              {/* SRS Practitioner Assessment */}
              <div 
                style={{
                  background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1e293b', marginBottom: '20px', margin: 0 }}>
                  SRS Practitioner Assessment
                </h4>
                
                {/* Section 1: Symptom & Key Finding Resolution */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '1rem', fontWeight: 600, color: '#475569', marginBottom: '16px', margin: 0 }}>
                    1️⃣ Symptom & Key Finding Resolution (max 1 point)
                  </h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '500', color: '#374151' }}>Criteria</div>
                    <div style={{ fontWeight: '500', color: '#374151', textAlign: 'center' }}>Score</div>
                    <div style={{ fontWeight: '500', color: '#374151', textAlign: 'center' }}>Notes</div>
                  </div>
                  
                  {/* Neurological */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.neurological.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('neurological', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Neurological: radicular pain, sensory changes, reflexes</span>
                    </div>
                    <select 
                      value={practitionerAssessment.neurological.score}
                      onChange={(e) => handlePractitionerAssessmentChange('neurological', 'score', e.target.value)}
                      disabled={!practitionerAssessment.neurological.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.neurological.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.neurological.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('neurological', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.neurological.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.neurological.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Mechanical/Local Pain */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.mechanical.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('mechanical', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Mechanical/local pain: facet, SIJ, muscle hypertonicity</span>
                    </div>
                    <select 
                      value={practitionerAssessment.mechanical.score}
                      onChange={(e) => handlePractitionerAssessmentChange('mechanical', 'score', e.target.value)}
                      disabled={!practitionerAssessment.mechanical.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.mechanical.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.mechanical.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('mechanical', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.mechanical.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.mechanical.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Orthopedic Tests */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.orthopedic.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('orthopedic', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Orthopedic test resolution</span>
                    </div>
                    <select 
                      value={practitionerAssessment.orthopedic.score}
                      onChange={(e) => handlePractitionerAssessmentChange('orthopedic', 'score', e.target.value)}
                      disabled={!practitionerAssessment.orthopedic.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.orthopedic.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.orthopedic.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('orthopedic', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.orthopedic.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.orthopedic.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Provocative Movements */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.provocative.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('provocative', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Pain during provocative movements</span>
                    </div>
                    <select 
                      value={practitionerAssessment.provocative.score}
                      onChange={(e) => handlePractitionerAssessmentChange('provocative', 'score', e.target.value)}
                      disabled={!practitionerAssessment.provocative.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.provocative.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.provocative.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('provocative', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.provocative.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.provocative.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Section 1 Score Summary */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ fontWeight: '500', color: '#475569' }}>Section 1 Score:</span>
                    <span style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 'bold', 
                      color: '#0c4a6e',
                      padding: '4px 12px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      border: '1px solid #0ea5e9'
                    }}>
                      {calculateSection1Score()}/1
                    </span>
                  </div>
                </div>
                
                {/* Section 2: Functional & Mechanical Progress */}
                <div style={{ marginBottom: '24px' }}>
                  <h5 style={{ fontSize: '1rem', fontWeight: '600', color: '#475569', marginBottom: '16px', margin: 0 }}>
                    2️⃣ Functional & Mechanical Progress (max 1 point)
                  </h5>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '500', color: '#374151' }}>Criteria</div>
                    <div style={{ fontWeight: '500', color: '#374151', textAlign: 'center' }}>Score</div>
                    <div style={{ fontWeight: '500', color: '#374151', textAlign: 'center' }}>Notes</div>
                  </div>
                  
                  {/* ROM/Flexibility */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.rom.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('rom', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>ROM/Flexibility</span>
                    </div>
                    <select 
                      value={practitionerAssessment.rom.score}
                      onChange={(e) => handlePractitionerAssessmentChange('rom', 'score', e.target.value)}
                      disabled={!practitionerAssessment.rom.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.rom.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.rom.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('rom', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.rom.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.rom.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Functional Tasks */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.functional.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('functional', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Functional Tasks</span>
                    </div>
                    <select 
                      value={practitionerAssessment.functional.score}
                      onChange={(e) => handlePractitionerAssessmentChange('functional', 'score', e.target.value)}
                      disabled={!practitionerAssessment.functional.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.functional.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.functional.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('functional', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.functional.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.functional.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Movement Pattern/Posture */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.movement.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('movement', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Movement Pattern/Posture</span>
                    </div>
                    <select 
                      value={practitionerAssessment.movement.score}
                      onChange={(e) => handlePractitionerAssessmentChange('movement', 'score', e.target.value)}
                      disabled={!practitionerAssessment.movement.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.movement.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.movement.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('movement', 'notes', e.target.value)}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.movement.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Strength/MMT */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.strength.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('strength', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Strength/MMT</span>
                    </div>
                    <select 
                      value={practitionerAssessment.strength.score}
                      onChange={(e) => handlePractitionerAssessmentChange('strength', 'score', e.target.value)}
                      disabled={!practitionerAssessment.strength.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.strength.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.strength.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('strength', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.strength.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.strength.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Balance/Proprioception */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.balance.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('balance', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Balance/Proprioception</span>
                    </div>
                    <select 
                      value={practitionerAssessment.balance.score}
                      onChange={(e) => handlePractitionerAssessmentChange('balance', 'score', e.target.value)}
                      disabled={!practitionerAssessment.balance.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.balance.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.balance.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('balance', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.balance.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.balance.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Stability/Endurance */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.stability.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('stability', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Stability/Endurance</span>
                    </div>
                    <select 
                      value={practitionerAssessment.stability.score}
                      onChange={(e) => handlePractitionerAssessmentChange('stability', 'score', e.target.value)}
                      disabled={!practitionerAssessment.stability.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.stability.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.stability.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('stability', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.stability.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.stability.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Treatment Response */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '12px', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <input 
                        type="checkbox" 
                        checked={practitionerAssessment.treatment.selected}
                        onChange={(e) => handlePractitionerAssessmentChange('treatment', 'selected', e.target.checked)}
                        style={{ width: '16px', height: '16px' }}
                      />
                      <span>Positive Response to Treatment</span>
                    </div>
                    <select 
                      value={practitionerAssessment.treatment.score}
                      onChange={(e) => handlePractitionerAssessmentChange('treatment', 'score', e.target.value)}
                      disabled={!practitionerAssessment.treatment.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.treatment.selected ? 'white' : '#f9fafb'
                      }}
                    >
                      <option value="0">0</option>
                      <option value="0.5">0.5</option>
                      <option value="1">1</option>
                    </select>
                    <input 
                      type="text" 
                      placeholder="Clinical details..."
                      value={practitionerAssessment.treatment.notes}
                      onChange={(e) => handlePractitionerAssessmentChange('treatment', 'notes', e.target.value)}
                      disabled={!practitionerAssessment.treatment.selected}
                      style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        border: '1px solid #d1d5db',
                        backgroundColor: practitionerAssessment.treatment.selected ? 'white' : '#f9fafb'
                      }}
                    />
                  </div>
                  
                  {/* Section 2 Score Summary */}
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginTop: '16px',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <span style={{ fontWeight: '500', color: '#475569' }}>Section 2 Score:</span>
                    <span style={{ 
                      fontSize: '1.125rem', 
                      fontWeight: 'bold', 
                      color: '#0c4a6e',
                      padding: '4px 12px',
                      backgroundColor: 'white',
                      borderRadius: '6px',
                      border: '1px solid #0ea5e9'
                    }}>
                      {calculateSection2Score()}/1
                    </span>
                  </div>
                </div>
                
                {/* Total Practitioner Score */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '16px',
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #0891b2 100%)',
                  borderRadius: '12px',
                  border: '2px solid #0ea5e9'
                }}>
                  <span style={{ fontWeight: '600', color: 'white', fontSize: '1.125rem' }}>
                    Total Practitioner Points:
                  </span>
                  <span style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: 'bold', 
                    color: 'white',
                    padding: '8px 16px',
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}>
                    {calculateTotalPractitionerScore()}/2
                  </span>
                </div>
                
                {/* Save Button */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button 
                    onClick={handleSavePractitionerAssessment}
                    style={{
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      color: 'white',
                      backgroundColor: '#0ea5e9',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#0891b2'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#0ea5e9'}
                  >
                    Save Practitioner Assessment
                  </button>
                </div>
              </div>

              {/* Notes Area */}
              <div 
                style={{
                  background: 'white',
                  padding: '24px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '20px', margin: 0 }}>
                  Clinical Notes
                </h4>
                
                {clinicalNotes.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                    {clinicalNotes.map((note, index) => (
                      <div 
                        key={note.id} 
                        style={{
                          background: '#f9fafb',
                          padding: '16px',
                          borderRadius: '8px',
                          border: '1px solid #e5e7eb',
                          position: 'relative'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              padding: '4px 8px',
                              fontSize: '0.75rem',
                              fontWeight: '500',
                              color: '#155e75',
                              backgroundColor: '#f0fdff',
                              borderRadius: '12px',
                              border: '1px solid #67e8f9'
                            }}>
                              {note.type}
                            </span>
                            <span style={{
                              fontSize: '0.75rem',
                              color: '#6b7280'
                            }}>
                              {new Date(note.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <button
                            onClick={() => handleDeleteNote(note.id)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: '#ef4444',
                              cursor: 'pointer',
                              padding: '4px',
                              borderRadius: '4px',
                              fontSize: '0.75rem'
                            }}
                            onMouseOver={(e) => e.target.style.backgroundColor = '#fef2f2'}
                            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                          >
                            🗑️
                          </button>
                        </div>
                        <p style={{ fontSize: '0.875rem', color: '#374151', margin: '0 0 8px 0', lineHeight: '1.5' }}>
                          {note.text}
                        </p>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          Added by: {note.clinicianName}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
                  <svg 
                    style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#d1d5db' }} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                    />
                  </svg>
                  <p style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 8px 0' }}>
                    {clinicalNotes.length === 0 ? 'No clinical notes yet' : `${clinicalNotes.length} clinical note${clinicalNotes.length === 1 ? '' : 's'}`}
                  </p>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>
                    {clinicalNotes.length === 0 ? 'Click "Add Note" to start documenting patient progress' : 'Click "Add Note" to add more notes'}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div 
                style={{
                  background: '#f9fafb',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}
              >
                <h4 style={{ fontSize: '1rem', fontWeight: 600, color: '#374151', marginBottom: '16px', margin: 0 }}>
                  Quick Actions
                </h4>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button 
                    onClick={handleScheduleReassessment}
                    disabled={quickActions.reassessmentScheduled}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: quickActions.reassessmentScheduled ? '#9ca3af' : '#155e75',
                      backgroundColor: quickActions.reassessmentScheduled ? '#f3f4f6' : 'white',
                      border: `1px solid ${quickActions.reassessmentScheduled ? '#d1d5db' : '#155e75'}`,
                      borderRadius: '6px',
                      cursor: quickActions.reassessmentScheduled ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseOver={(e) => {
                      if (!quickActions.reassessmentScheduled) {
                        e.target.style.backgroundColor = '#f0fdff';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!quickActions.reassessmentScheduled) {
                        e.target.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {quickActions.reassessmentScheduled ? '✅' : '📅'} 
                    {quickActions.reassessmentScheduled ? 'Reassessment Scheduled' : 'Schedule Reassessment'}
                  </button>
                  <button 
                    onClick={handleUpdateTreatmentPlan}
                    disabled={quickActions.treatmentPlanUpdated}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: quickActions.treatmentPlanUpdated ? '#9ca3af' : '#155e75',
                      backgroundColor: quickActions.treatmentPlanUpdated ? '#f3f4f6' : 'white',
                      border: `1px solid ${quickActions.treatmentPlanUpdated ? '#d1d5db' : '#155e75'}`,
                      borderRadius: '6px',
                      cursor: quickActions.treatmentPlanUpdated ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseOver={(e) => {
                      if (!quickActions.treatmentPlanUpdated) {
                        e.target.style.backgroundColor = '#f0fdff';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!quickActions.treatmentPlanUpdated) {
                        e.target.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {quickActions.treatmentPlanUpdated ? '✅' : '📋'} 
                    {quickActions.treatmentPlanUpdated ? 'Treatment Plan Updated' : 'Update Treatment Plan'}
                  </button>
                  <button 
                    onClick={handleMarkAsReviewed}
                    disabled={quickActions.reviewed}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: quickActions.reviewed ? '#9ca3af' : '#155e75',
                      backgroundColor: quickActions.reviewed ? '#f3f4f6' : 'white',
                      border: `1px solid ${quickActions.reviewed ? '#d1d5db' : '#155e75'}`,
                      borderRadius: '6px',
                      cursor: quickActions.reviewed ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                    onMouseOver={(e) => {
                      if (!quickActions.reviewed) {
                        e.target.style.backgroundColor = '#f0fdff';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!quickActions.reviewed) {
                        e.target.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    {quickActions.reviewed ? '✅' : '👁️'} 
                    {quickActions.reviewed ? 'Marked as Reviewed' : 'Mark as Reviewed'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div 
          style={{
            background: '#f9fafb',
            padding: '20px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid #e5e7eb',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px'
          }}
        >
          <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
            Patient ID: {patient.id} • Last updated: {formatDate(patient.updatedAt)}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              style={{
                padding: '10px 20px',
                color: '#155e75',
                border: '2px solid #155e75',
                borderRadius: '8px',
                background: 'white',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f0fdff';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
              onClick={() => setShowMessageModal(true)}
            >
              💬 Send Message
            </button>
            <button 
              style={{
                padding: '10px 20px',
                background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(21, 94, 117, 0.2)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(21, 94, 117, 0.3)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 4px rgba(21, 94, 117, 0.2)';
              }}
              onClick={async () => {
                try {
                  const response = await fetch(`${API_URL}/api/messages/send`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      patientId: patient.id,
                      subject: 'Appointment Reminder',
                      content: `Hi ${patient.name},\n\nIt's time to schedule your next follow-up appointment. Please log into your patient portal to book a time that works for you.\n\nWe look forward to seeing you!\n\nBest regards,\nYour Back to Life Team`,
                      senderName: 'Clinician',
                      senderEmail: 'clinician@backtolife.ca',
                      messageType: 'appointment_reminder'
                    })
                  });

                  const result = await response.json();

                  if (result.success) {
                    alert(`✅ Appointment reminder sent to ${patient.name}!\n\nThe reminder will appear on their dashboard when they log into their patient portal.`);
                  } else {
                    throw new Error(result.error || 'Failed to send appointment reminder');
                  }
                } catch (error) {
                  console.error('Error sending appointment reminder:', error);
                  alert(`❌ Failed to send appointment reminder: ${error.message}\n\nPlease check your connection and try again.`);
                }
              }}
            >
              📅 Schedule Follow-up
            </button>
          </div>
        </div>
      </div>

      {/* Message Composition Modal */}
      {showMessageModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Message Modal Header */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                color: 'white',
                padding: '20px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, marginBottom: '4px' }}>
                    Send Message
                  </h3>
                  <p style={{ fontSize: '0.875rem', opacity: 0.9, margin: 0 }}>
                    To: {patient.name} ({patient.email})
                  </p>
                </div>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Message Form */}
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
              {/* Subject Field */}
              <div>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Subject
                </label>
                <input
                  type="text"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                  placeholder="Recovery check-in, follow-up reminder, etc."
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#155e75'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Message Field */}
              <div style={{ flex: 1 }}>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Message
                </label>
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Hi [Patient Name], I wanted to check in on your recovery progress..."
                  rows={8}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    resize: 'vertical',
                    minHeight: '120px',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#155e75'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>

              {/* Message Templates */}
              <div>
                <label 
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: '8px'
                  }}
                >
                  Quick Templates
                </label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {[
                    { label: 'Check-in', text: `Hi ${patient.name}, I wanted to check in on your recovery progress. How are you feeling with your current exercises?` },
                    { label: 'Reminder', text: `Hi ${patient.name}, this is a friendly reminder to complete your daily recovery tasks in your patient portal.` },
                    { label: 'Encouragement', text: `Hi ${patient.name}, you're making great progress in your recovery journey! Keep up the excellent work.` }
                  ].map((template, index) => (
                    <button
                      key={index}
                      onClick={() => setMessageText(template.text)}
                      style={{
                        padding: '6px 12px',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        color: '#155e75',
                        backgroundColor: '#f0fdff',
                        border: '1px solid #67e8f9',
                        borderRadius: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#67e8f9';
                        e.target.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#f0fdff';
                        e.target.style.color = '#155e75';
                      }}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Message Modal Footer */}
            <div 
              style={{
                background: '#f9fafb',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #e5e7eb',
                borderBottomLeftRadius: '16px',
                borderBottomRightRadius: '16px'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                This message will appear in the patient's portal
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  onClick={() => setShowMessageModal(false)}
                  style={{
                    padding: '10px 20px',
                    color: '#6b7280',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    background: 'white',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                  onMouseOut={(e) => e.target.style.background = 'white'}
                >
                  Cancel
                </button>
                <button 
                  onClick={async () => {
                    try {
                      const response = await fetch(`${API_URL}/api/messages/send`, {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          patientId: patient.id,
                          subject: messageSubject,
                          content: messageText,
                          senderName: 'Clinician', // TODO: Get from authenticated user context
                          senderEmail: 'clinician@backtolife.ca' // TODO: Get from authenticated user context
                        })
                      });

                      const result = await response.json();

                      if (result.success) {
                        alert(`✅ Message sent successfully to ${patient.name}!\n\nSubject: ${messageSubject}\n\nThe message will appear in their patient portal.`);
                    setShowMessageModal(false);
                    setMessageText('');
                    setMessageSubject('');
                      } else {
                        throw new Error(result.error || 'Failed to send message');
                      }
                    } catch (error) {
                      console.error('Error sending message:', error);
                      alert(`❌ Failed to send message: ${error.message}\n\nPlease check your connection and try again.`);
                    }
                  }}
                  disabled={!messageText.trim() || !messageSubject.trim()}
                  style={{
                    padding: '10px 20px',
                    background: (!messageText.trim() || !messageSubject.trim()) 
                      ? '#d1d5db' 
                      : 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: (!messageText.trim() || !messageSubject.trim()) ? 'not-allowed' : 'pointer',
                    boxShadow: (!messageText.trim() || !messageSubject.trim()) 
                      ? 'none' 
                      : '0 2px 4px rgba(21, 94, 117, 0.2)',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    if (messageText.trim() && messageSubject.trim()) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 8px rgba(21, 94, 117, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (messageText.trim() && messageSubject.trim()) {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = '0 2px 4px rgba(21, 94, 117, 0.2)';
                    }
                  }}
                >
                  Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {showAddNoteModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            padding: '20px'
          }}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Modal Header */}
            <div 
              style={{
                background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                color: 'white',
                padding: '20px',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
                  Add Clinical Note
                </h3>
                <button 
                  onClick={() => setShowAddNoteModal(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                  onMouseOut={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px', flex: 1 }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Note Type
                </label>
                <select
                  value={newNoteType}
                  onChange={(e) => setNewNoteType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    fontSize: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white'
                  }}
                >
                  <option value="general">General Note</option>
                  <option value="assessment">Assessment</option>
                  <option value="treatment">Treatment</option>
                  <option value="progress">Progress Update</option>
                  <option value="concern">Concern</option>
                  <option value="recommendation">Recommendation</option>
                </select>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>
                  Clinical Note
                </label>
                <textarea
                  value={newNoteText}
                  onChange={(e) => setNewNoteText(e.target.value)}
                  placeholder="Enter your clinical note here..."
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    fontSize: '0.875rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div 
              style={{
                background: '#f9fafb',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
                borderTop: '1px solid #e5e7eb'
              }}
            >
              <button 
                onClick={() => setShowAddNoteModal(false)}
                style={{
                  padding: '10px 20px',
                  color: '#6b7280',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.background = '#f9fafb'}
                onMouseOut={(e) => e.target.style.background = 'white'}
              >
                Cancel
              </button>
              <button 
                onClick={handleAddNote}
                disabled={!newNoteText.trim()}
                style={{
                  padding: '10px 20px',
                  background: !newNoteText.trim() ? '#d1d5db' : 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: !newNoteText.trim() ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseOver={(e) => {
                  if (newNoteText.trim()) {
                    e.target.style.transform = 'translateY(-1px)';
                  }
                }}
                onMouseOut={(e) => {
                  if (newNoteText.trim()) {
                    e.target.style.transform = 'translateY(0)';
                  }
                }}
              >
                Add Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientModal; 