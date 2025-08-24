import { useState, useEffect } from "react";
import * as clinicianApi from "../services/clinicianApi";

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
  const [recoveryMilestone, setRecoveryMilestone] = useState(patient?.recoveryMilestone || false);
  const [clinicalProgressVerified, setClinicalProgressVerified] = useState(patient?.clinicalProgressVerified || false);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [noteInput, setNoteInput] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load clinical notes when modal opens
  useEffect(() => {
    if (patient?.id) {
      loadClinicalNotes();
    }
  }, [patient?.id]);

  const loadClinicalNotes = async () => {
    try {
      const notes = await clinicianApi.fetchClinicalNotes(patient.id);
      setClinicalNotes(notes);
    } catch (error) {
      console.error('Failed to load notes:', error);
    }
  };

  // API Functions
  const handleSaveAssessment = async () => {
    try {
      setIsLoading(true);
      await clinicianApi.saveClinicianAssessment(patient.id, {
        recoveryMilestoneAchieved: recoveryMilestone,
        clinicalProgressVerified: clinicalProgressVerified,
        comments: assessmentComments || null
      });
      
      alert('Clinician assessment saved successfully!');
      // Optionally refresh patient data
    } catch (error) {
      console.error('Failed to save assessment:', error);
      alert(`Failed to save assessment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!noteInput.trim()) return;
    
    setIsAddingNote(true);
    try {
      const newNote = await clinicianApi.addClinicalNote(patient.id, noteInput);
      setClinicalNotes(prev => [newNote, ...prev]);
      setNoteInput('');
      alert('Note added successfully!');
    } catch (error) {
      console.error('Failed to add note:', error);
      alert(`Failed to add note: ${error.message}`);
    } finally {
      setIsAddingNote(false);
    }
  };

  const handleMarkReviewed = async () => {
    try {
      setIsLoading(true);
      await clinicianApi.markPatientReviewed(patient.id);
      alert('Patient marked as reviewed!');
    } catch (error) {
      console.error('Failed to mark as reviewed:', error);
      alert(`Failed to mark as reviewed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTreatmentPlan = async () => {
    const plan = prompt('Enter new treatment plan:');
    if (!plan) return;
    
    try {
      setIsLoading(true);
      await clinicianApi.updateTreatmentPlan(patient.id, plan);
      alert('Treatment plan updated successfully!');
    } catch (error) {
      console.error('Failed to update treatment plan:', error);
      alert(`Failed to update treatment plan: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleReassessment = async () => {
    const date = prompt('Enter reassessment date (YYYY-MM-DD):');
    if (!date) return;
    
    try {
      setIsLoading(true);
      await clinicianApi.scheduleReassessment(patient.id, date);
      alert('Reassessment scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule reassessment:', error);
      alert(`Failed to schedule reassessment: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

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

              {/* SRS Clinician Input */}
              <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#155e75', marginBottom: '12px', margin: 0 }}>
                  SRS Clinician Assessment
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {/* Recovery Milestone */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={recoveryMilestone}
                      onChange={(e) => {
                        setRecoveryMilestone(e.target.checked);
                        // Here you would typically call an API to update the patient
                        console.log('Recovery Milestone updated:', e.target.checked);
                      }}
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
                      checked={clinicalProgressVerified}
                      onChange={(e) => {
                        setClinicalProgressVerified(e.target.checked);
                        // Here you would typically call an API to update the patient
                        console.log('Clinical Progress Verified updated:', e.target.checked);
                      }}
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
                    onClick={handleSaveAssessment}
                    disabled={isLoading}
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
                      {isLoading ? 'Saving...' : 'Save Clinician Assessment'}
                    </button>
                </div>

                {/* Current SRS Score Display */}
                <div style={{ 
                  marginTop: '16px', 
                  padding: '12px', 
                  backgroundColor: '#f0fdff', 
                  borderRadius: '6px', 
                  border: '1px solid #67e8f9',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>
                    Current SRS Score
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#155e75' }}>
                    {srsScore}/11
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginTop: '2px' }}>
                    Phase: {phase}
                  </div>
                </div>

                {/* SRS Breakdown */}
                <div style={{ marginTop: '12px', fontSize: '0.75rem', color: '#6b7280' }}>
                  <div style={{ marginBottom: '4px' }}>
                    <strong>SRS Breakdown:</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.7rem' }}>
                    <div>• Pain Assessment: +1 pt</div>
                    <div>• Disability Index: +1 pt</div>
                    <div>• PSFS Function: +2 pts</div>
                    <div>• Confidence Level: +2 pts</div>
                    <div>• Beliefs Resolved: +1 pt</div>
                    <div>• Clinician Assessment: +2 pts</div>
                  </div>
                </div>
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
                {/* Add Note Input */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value)}
                      placeholder="Add clinical note..."
                      style={{
                        flex: 1,
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '6px',
                        fontSize: '0.875rem'
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNote()}
                    />
                    <button
                      onClick={handleAddNote}
                      disabled={isAddingNote || !noteInput.trim()}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #155e75 0%, #0891b2 100%)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: isAddingNote ? 'not-allowed' : 'pointer',
                        opacity: isAddingNote ? 0.6 : 1
                      }}
                    >
                      {isAddingNote ? 'Adding...' : 'Add Note'}
                    </button>
                  </div>
                </div>

                {/* Clinical Notes Display */}
                {clinicalNotes.length === 0 ? (
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
                    <p style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 8px 0' }}>No clinical notes yet</p>
                    <p style={{ fontSize: '0.875rem', margin: 0 }}>Click "Add Note" to start documenting patient progress</p>
                  </div>
                ) : (
                  <div>
                    {clinicalNotes.map(note => (
                      <div key={note.id} style={{ 
                        padding: '12px', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '6px', 
                        marginBottom: '8px',
                        backgroundColor: '#f9fafb'
                      }}>
                        <div style={{ fontSize: '0.875rem', color: '#374151', marginBottom: '4px' }}>
                          {new Date(note.createdAt).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                          {note.note}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    disabled={isLoading}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#155e75',
                      backgroundColor: 'white',
                      border: '1px solid #155e75',
                      borderRadius: '6px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isLoading ? 0.6 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) e.target.style.backgroundColor = '#f0fdff';
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) e.target.style.backgroundColor = 'white';
                    }}
                  >
                    {isLoading ? 'Scheduling...' : 'Schedule Reassessment'}
                  </button>
                  <button 
                    onClick={handleUpdateTreatmentPlan}
                    disabled={isLoading}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#155e75',
                      backgroundColor: 'white',
                      border: '1px solid #155e75',
                      borderRadius: '6px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isLoading ? 0.6 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) e.target.style.backgroundColor = '#f0fdff';
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) e.target.style.backgroundColor = 'white';
                    }}
                  >
                    {isLoading ? 'Updating...' : 'Update Treatment Plan'}
                  </button>
                  <button 
                    onClick={handleMarkReviewed}
                    disabled={isLoading}
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#155e75',
                      backgroundColor: 'white',
                      border: '1px solid #155e75',
                      borderRadius: '6px',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      opacity: isLoading ? 0.6 : 1
                    }}
                    onMouseOver={(e) => {
                      if (!isLoading) e.target.style.backgroundColor = '#f0fdff';
                    }}
                    onMouseOut={(e) => {
                      if (!isLoading) e.target.style.backgroundColor = 'white';
                    }}
                  >
                    {isLoading ? 'Marking...' : 'Mark as Reviewed'}
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
                  const response = await fetch('https://framework-production-92f5.up.railway.app/api/messages/send', {
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
                      const response = await fetch('https://framework-production-92f5.up.railway.app/api/messages/send', {
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
    </div>
  );
}

export default PatientModal; 