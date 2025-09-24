// Clinician Dashboard API Service
// Handles all clinician dashboard operations

const API_BASE = '/patients'; // This will be proxied to the backend

// Clinical Notes
export const fetchClinicalNotes = async (patientId) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/notes`, {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.notes || [];
  } catch (error) {
    console.error('Error fetching clinical notes:', error);
    throw error;
  }
};

export const addClinicalNote = async (patientId, noteText, authorId = null) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: noteText, authorId }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.note;
  } catch (error) {
    console.error('Error adding clinical note:', error);
    throw error;
  }
};

export const updateClinicalNote = async (patientId, noteId, noteText) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/notes/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: noteText }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.note;
  } catch (error) {
    console.error('Error updating clinical note:', error);
    throw error;
  }
};

export const deleteClinicalNote = async (patientId, noteId) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/notes/${noteId}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting clinical note:', error);
    throw error;
  }
};

// Clinician Assessment
export const saveClinicianAssessment = async (patientId, assessmentData) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/assessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(assessmentData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.assessment;
  } catch (error) {
    console.error('Error saving clinician assessment:', error);
    throw error;
  }
};

// Mark as Reviewed
export const markPatientReviewed = async (patientId) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/review`, {
      method: 'PATCH',
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.patient;
  } catch (error) {
    console.error('Error marking patient as reviewed:', error);
    throw error;
  }
};

// Update Treatment Plan
export const updateTreatmentPlan = async (patientId, plan) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/treatment-plan`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ plan }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.patient;
  } catch (error) {
    console.error('Error updating treatment plan:', error);
    throw error;
  }
};

// Schedule Reassessment
export const scheduleReassessment = async (patientId, scheduledAt) => {
  try {
    const response = await fetch(`${API_BASE}/${patientId}/reassessment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ scheduledAt }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.patient;
  } catch (error) {
    console.error('Error scheduling reassessment:', error);
    throw error;
  }
};




