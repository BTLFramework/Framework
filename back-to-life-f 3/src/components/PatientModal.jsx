import { useState } from "react";
import SRSDisplay from "./SRSDisplay";

function PatientModal({ patient, onClose }) {
  console.log('🎭 PatientModal - patient received:', !!patient);
  if (patient) {
    console.log('🔍 Patient has srsScores:', !!patient.srsScores, 'length:', patient.srsScores?.length);
    console.log('🔍 Patient srsScores[0]:', patient.srsScores?.[0]);
  }
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [messageSubject, setMessageSubject] = useState('');

  if (!patient) {
    console.log('❌ PatientModal: No patient data provided');
    return null;
  }

  // Get the latest SRS score data
  const latestScore = patient.srsScores?.[0] || {};
  const srsScore = patient.latestSrsScore || latestScore.srsScore || 0;
  const phase = patient.phase || { label: 'UNKNOWN', color: 'gray' };

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
  const psfsActivities = latestScore.psfs || [];

  // Beliefs
  const beliefs = latestScore.beliefs || [];

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
                  <SRSDisplay 
                    score={srsScore}
                    clinicianAssessed={latestScore.clinicianAssessed || false}
                    grocCaptured={latestScore.grocCaptured || false}
                    variant="compact"
                  />
                  <div style={{ textAlign: 'right' }}>
                    <div 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        backgroundColor: srsScore >= 8 ? '#d1fae5' : srsScore >= 5 ? '#fef3c7' : '#fecaca',
                        color: srsScore >= 8 ? '#065f46' : srsScore >= 5 ? '#92400e' : '#991b1b'
                      }}
                    >
                      {phase.label || phase} Phase
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
                    color: '#155e75',
                    marginBottom: '6px'
                  }}>
                    {latestScore.vas || 'N/A'}/10
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>Pain Level</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 6px',
                    borderRadius: '10px',
                    backgroundColor: latestScore.vas >= 7 ? '#fecaca' : latestScore.vas >= 4 ? '#fef3c7' : '#d1fae5',
                    color: latestScore.vas >= 7 ? '#991b1b' : latestScore.vas >= 4 ? '#92400e' : '#065f46',
                    fontWeight: 600
                  }}>
                    {latestScore.vas >= 7 ? 'High' : latestScore.vas >= 4 ? 'Moderate' : 'Low'}
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
                    color: '#155e75',
                    marginBottom: '6px'
                  }}>
                    {latestScore.confidence || 'N/A'}/10
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>Confidence</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 6px',
                    borderRadius: '10px',
                    backgroundColor: latestScore.confidence >= 7 ? '#d1fae5' : latestScore.confidence >= 4 ? '#fef3c7' : '#fecaca',
                    color: latestScore.confidence >= 7 ? '#065f46' : latestScore.confidence >= 4 ? '#92400e' : '#991b1b',
                    fontWeight: 600
                  }}>
                    {latestScore.confidence >= 7 ? 'High' : latestScore.confidence >= 4 ? 'Moderate' : 'Low'}
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
                    color: '#155e75',
                    marginBottom: '6px'
                  }}>
                    {latestScore.disabilityPercentage || 0}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: 500, marginBottom: '6px' }}>Disability</div>
                  <div style={{ 
                    fontSize: '0.7rem', 
                    padding: '3px 6px',
                    borderRadius: '10px',
                    backgroundColor: latestScore.disabilityPercentage >= 30 ? '#fecaca' : latestScore.disabilityPercentage >= 15 ? '#fef3c7' : '#d1fae5',
                    color: latestScore.disabilityPercentage >= 30 ? '#991b1b' : latestScore.disabilityPercentage >= 15 ? '#92400e' : '#065f46',
                    fontWeight: 600
                  }}>
                    {latestScore.disabilityPercentage >= 30 ? 'Severe' : latestScore.disabilityPercentage >= 15 ? 'Moderate' : 'Mild'}
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
                    {latestScore.region || 'N/A'}
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
                        color: '#155e75', 
                        fontSize: '0.875rem',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#67e8f9'
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
                  {formatDate(latestScore.createdAt)}
                </div>
              </div>

              {/* Ultra Compact Overview */}
              <div style={{ background: 'white', padding: '12px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem' }}><strong>Region:</strong> {latestScore.region || 'N/A'}</span>
                  <SRSDisplay 
                    score={srsScore}
                    clinicianAssessed={latestScore.clinicianAssessed || false}
                    grocCaptured={latestScore.grocCaptured || false}
                    variant="compact"
                  />
                  <span style={{ 
                    fontSize: '0.75rem',
                    color: latestScore.clinicianAssessed ? '#059669' : '#d97706',
                    fontWeight: '600'
                  }}>
                    <strong>Reviewed:</strong> {latestScore.clinicianAssessed ? 'Yes' : 'No'}
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
                      color: latestScore.vas >= 7 ? '#dc2626' : latestScore.vas >= 4 ? '#d97706' : '#059669'
                    }}>
                      {latestScore.vas || 'N/A'}/10
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(latestScore.vas || 0) * 10}%`, 
                      height: '100%', 
                      backgroundColor: latestScore.vas >= 7 ? '#dc2626' : latestScore.vas >= 4 ? '#d97706' : '#059669'
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
                      color: latestScore.confidence >= 7 ? '#059669' : latestScore.confidence >= 4 ? '#d97706' : '#dc2626'
                    }}>
                      {latestScore.confidence || 'N/A'}/10
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ 
                      width: `${(latestScore.confidence || 0) * 10}%`, 
                      height: '100%', 
                      backgroundColor: latestScore.confidence >= 7 ? '#059669' : latestScore.confidence >= 4 ? '#d97706' : '#dc2626'
                    }}></div>
                  </div>
                </div>

                {/* NDI */}
                {latestScore.region === 'Neck' && (
                  <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>NDI</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: 'bold', 
                        color: latestScore.disabilityPercentage >= 30 ? '#dc2626' : latestScore.disabilityPercentage >= 15 ? '#d97706' : '#059669'
                      }}>
                        {latestScore.disabilityPercentage || 0}%
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '4px', backgroundColor: '#f3f4f6', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ 
                        width: `${latestScore.disabilityPercentage || 0}%`, 
                        height: '100%', 
                        backgroundColor: latestScore.disabilityPercentage >= 30 ? '#dc2626' : latestScore.disabilityPercentage >= 15 ? '#d97706' : '#059669'
                      }}></div>
                    </div>
                  </div>
                )}

                {/* GROC */}
                <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <div style={{ fontSize: '0.7rem', color: '#6b7280', marginBottom: '4px' }}>GROC</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 'bold', color: latestScore.groc > 0 ? '#059669' : latestScore.groc < 0 ? '#dc2626' : '#6b7280' }}>
                    {latestScore.groc || 'N/A'}
                  </div>
                </div>
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
                            color: activity.score >= 8 ? '#059669' : activity.score >= 6 ? '#d97706' : '#dc2626',
                            minWidth: '32px'
                          }}>
                            {activity.score}/10
                          </span>
                          <div style={{ width: '40px', height: '3px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                            <div style={{ 
                              width: `${activity.score * 10}%`, 
                              height: '100%', 
                              backgroundColor: activity.score >= 8 ? '#059669' : activity.score >= 6 ? '#d97706' : '#dc2626'
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

              {/* Beliefs - Compact */}
              <div style={{ background: 'white', padding: '8px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '6px', margin: 0 }}>
                  Beliefs & Concerns
                </h4>
                {beliefs && beliefs.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    {beliefs.map((belief, index) => (
                      <div key={index} style={{ padding: '4px 6px', backgroundColor: '#fef3c7', borderRadius: '3px', fontSize: '0.7rem', color: '#92400e' }}>
                        • {belief}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '6px', backgroundColor: '#f9fafb', borderRadius: '4px', color: '#6b7280', fontSize: '0.7rem' }}>
                    No concerns recorded
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
                  {latestScore.vas >= 7 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#dc2626', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#991b1b' }}>
                        High pain levels reported (VAS: {latestScore.vas}/10)
                      </span>
                    </div>
                  )}
                  {latestScore.confidence <= 3 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ 
                        width: '8px', 
                        height: '8px', 
                        backgroundColor: '#d97706', 
                        borderRadius: '50%' 
                      }}></div>
                      <span style={{ fontSize: '0.875rem', color: '#92400e' }}>
                        Low confidence in recovery ({latestScore.confidence}/10)
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
                  {daysSinceIntake <= 28 && latestScore.vas < 7 && latestScore.confidence > 3 && (!beliefs.length || beliefs.every(b => b.includes('None'))) && (
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
                      {phase.label || phase}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Current Phase</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#155e75' }}>
                      {srsScore}/{latestScore.outOf || 11}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Recovery Score</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: latestScore.clinicianAssessed ? '#059669' : '#d97706' }}>
                      {latestScore.clinicianAssessed ? 'Yes' : 'No'}
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
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#155e75',
                      backgroundColor: 'white',
                      border: '1px solid #155e75',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f0fdff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}
                  >
                    Schedule Reassessment
                  </button>
                  <button 
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#155e75',
                      backgroundColor: 'white',
                      border: '1px solid #155e75',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f0fdff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}
                  >
                    Update Treatment Plan
                  </button>
                  <button 
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: '#155e75',
                      backgroundColor: 'white',
                      border: '1px solid #155e75',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#f0fdff';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'white';
                    }}
                  >
                    Mark as Reviewed
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
              onClick={() => {
                alert(`Schedule follow-up appointment for ${patient.name}`);
                // TODO: Implement scheduling functionality
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
                      const response = await fetch('http://localhost:3001/api/messages/send', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          patientId: patient.id,
                          subject: messageSubject,
                          content: messageText,
                          senderName: 'Dr. Sarah Mitchell', // You can make this dynamic
                          senderEmail: 'dr.mitchell@clinic.com'
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