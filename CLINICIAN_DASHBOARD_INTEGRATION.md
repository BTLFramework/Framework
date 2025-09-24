# 🏥 Clinician Dashboard Integration Guide

## 🎯 Overview

This guide shows how to wire up your clinician dashboard buttons to the new backend endpoints. All endpoints are now available and ready to use without any CORS changes needed.

## 🚀 Backend Status

✅ **Database Schema Updated** - New fields added to Patient model  
✅ **New Routes Added** - All clinician dashboard endpoints available  
✅ **Controllers Created** - Safe, minimal Express handlers  
✅ **Prisma Client Generated** - Database operations ready  

## 📍 Available Endpoints

All endpoints are available at `/patients/:id/*` and will be proxied through your existing setup:

### Clinical Notes
- `GET /patients/:id/notes` - List all notes for a patient
- `POST /patients/:id/notes` - Add a new note
- `PATCH /patients/:id/notes/:noteId` - Update a note
- `DELETE /patients/:id/notes/:noteId` - Delete a note

### Clinician Assessment
- `POST /patients/:id/assessment` - Save clinician assessment

### Patient Management
- `PATCH /patients/:id/review` - Mark patient as reviewed
- `PATCH /patients/:id/treatment-plan` - Update treatment plan
- `POST /patients/:id/reassessment` - Schedule reassessment

## 🔧 Frontend Integration

### 1. Import the API Service

```javascript
import * as clinicianApi from '../services/clinicianApi';
```

### 2. Add State for Clinical Notes

```javascript
const [clinicalNotes, setClinicalNotes] = useState([]);
const [noteInput, setNoteInput] = useState('');
const [isAddingNote, setIsAddingNote] = useState(false);
```

### 3. Load Notes on Modal Open

```javascript
useEffect(() => {
  if (isOpen && patient?.id) {
    loadClinicalNotes();
  }
}, [isOpen, patient?.id]);

const loadClinicalNotes = async () => {
  try {
    const notes = await clinicianApi.fetchClinicalNotes(patient.id);
    setClinicalNotes(notes);
  } catch (error) {
    console.error('Failed to load notes:', error);
    // Handle error (show toast, etc.)
  }
};
```

### 4. Wire Up Add Note Button

```javascript
const handleAddNote = async () => {
  if (!noteInput.trim()) return;
  
  setIsAddingNote(true);
  try {
    const newNote = await clinicianApi.addClinicalNote(patient.id, noteInput);
    setClinicalNotes(prev => [newNote, ...prev]);
    setNoteInput('');
    // Show success message
  } catch (error) {
    console.error('Failed to add note:', error);
    // Handle error
  } finally {
    setIsAddingNote(false);
  }
};
```

### 5. Wire Up Save Clinician Assessment

```javascript
const handleSaveAssessment = async () => {
  try {
    await clinicianApi.saveClinicianAssessment(patient.id, {
      recoveryMilestoneAchieved: recoveryMilestone,
      clinicalProgressVerified: clinicalProgressVerified,
      comments: assessmentComments || null
    });
    
    // Show success message
    // Optionally refresh patient data
  } catch (error) {
    console.error('Failed to save assessment:', error);
    // Handle error
  }
};
```

### 6. Wire Up Quick Action Buttons

```javascript
// Mark as Reviewed
const handleMarkReviewed = async () => {
  try {
    await clinicianApi.markPatientReviewed(patient.id);
    // Show success message
    // Optionally refresh patient data
  } catch (error) {
    console.error('Failed to mark as reviewed:', error);
  }
};

// Update Treatment Plan
const handleUpdateTreatmentPlan = async () => {
  const plan = prompt('Enter new treatment plan:');
  if (!plan) return;
  
  try {
    await clinicianApi.updateTreatmentPlan(patient.id, plan);
    // Show success message
  } catch (error) {
    console.error('Failed to update treatment plan:', error);
  }
};

// Schedule Reassessment
const handleScheduleReassessment = async () => {
  const date = prompt('Enter reassessment date (YYYY-MM-DD):');
  if (!date) return;
  
  try {
    await clinicianApi.scheduleReassessment(patient.id, date);
    // Show success message
  } catch (error) {
    console.error('Failed to schedule reassessment:', error);
  }
};
```

## 🎨 UI Updates Needed

### 1. Clinical Notes Section

Replace the static "No clinical notes yet" with:

```javascript
{clinicalNotes.length === 0 ? (
  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#6b7280' }}>
    <svg style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#d1d5db' }} 
         fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
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
```

### 2. Add Note Input

Add this above the clinical notes section:

```javascript
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
```

### 3. Update Quick Action Buttons

Add onClick handlers to each button:

```javascript
<button onClick={handleScheduleReassessment}>
  Schedule Reassessment
</button>

<button onClick={handleUpdateTreatmentPlan}>
  Update Treatment Plan
</button>

<button onClick={handleMarkReviewed}>
  Mark as Reviewed
</button>
```

## 🧪 Testing

### 1. Test Endpoints (Replace with your actual domain)

```bash
# Test clinical notes
curl -i https://your-dashboard-domain/patients/1/notes
curl -i -X POST https://your-dashboard-domain/patients/1/notes \
  -H 'Content-Type: application/json' \
  --data '{"text":"Test note"}'

# Test clinician assessment
curl -i -X POST https://your-dashboard-domain/patients/1/assessment \
  -H 'Content-Type: application/json' \
  --data '{"recoveryMilestoneAchieved":true,"clinicalProgressVerified":false,"comments":"test"}'

# Test mark as reviewed
curl -i -X PATCH https://your-dashboard-domain/patients/1/review

# Test treatment plan
curl -i -X PATCH https://your-dashboard-domain/patients/1/treatment-plan \
  -H 'Content-Type: application/json' \
  --data '{"plan":"Test treatment plan"}'

# Test reassessment
curl -i -X POST https://your-dashboard-domain/patients/1/reassessment \
  -H 'Content-Type: application/json' \
  --data '{"scheduledAt":"2025-09-01T15:00:00.000Z"}'
```

### 2. Frontend Testing

1. Open patient modal
2. Add a clinical note
3. Save clinician assessment
4. Test quick action buttons
5. Verify data persists after refresh

## 🚨 Error Handling

The API service includes comprehensive error handling. Consider adding user-friendly error messages:

```javascript
const [error, setError] = useState(null);

const handleApiCall = async (apiFunction, ...args) => {
  try {
    setError(null);
    const result = await apiFunction(...args);
    // Handle success
    return result;
  } catch (error) {
    setError(error.message);
    // Show error toast/notification
    throw error;
  }
};
```

## 🔄 Data Refresh

After successful operations, consider refreshing patient data:

```javascript
const refreshPatientData = () => {
  // Trigger parent component to refresh patient list
  if (onPatientUpdate) {
    onPatientUpdate();
  }
};

// Call this after successful operations
refreshPatientData();
```

## ✨ Next Steps

1. **Deploy Backend** - Push your updated backend to Railway
2. **Update Dashboard** - Wire up the buttons using this guide
3. **Test Integration** - Verify all endpoints work correctly
4. **Add Error Handling** - Implement user-friendly error messages
5. **Add Loading States** - Show loading indicators during API calls

## 🎉 You're Ready!

Your backend is now fully equipped to handle all clinician dashboard operations. The endpoints are safe, minimal, and won't destabilize your existing system. Just wire up the frontend buttons and you'll have a fully functional clinician dashboard!




