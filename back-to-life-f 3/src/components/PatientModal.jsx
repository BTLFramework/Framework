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
  
  const phase = getPhase(patient.srs);
  const phaseInfo = {
    "RESET": {
      color: "text-btl-700",
      bgColor: "bg-gradient-to-r from-btl-100 to-btl-200",
      borderColor: "border-btl-300"
    },
    "EDUCATE": {
      color: "text-amber-700", 
      bgColor: "bg-gradient-to-r from-amber-100 to-amber-200",
      borderColor: "border-amber-300"
    },
    "REBUILD": {
      color: "text-emerald-700",
      bgColor: "bg-gradient-to-r from-emerald-100 to-emerald-200", 
      borderColor: "border-emerald-300"
    }
  };

  const currentPhaseInfo = phaseInfo[phase];

  // Enhanced SRS badge
  const srsBadge = (srs) => {
    let badgeClass = "";
    if (srs >= 8) {
      badgeClass = "badge-gold";
    } else if (srs >= 5) {
      badgeClass = "badge-silver";
    } else {
      badgeClass = "badge-bronze";
    }
    
    return (
      <span className={`inline-flex items-center justify-center w-16 h-12 rounded-xl text-lg font-bold ${badgeClass} shadow-lg`}>
        {srs}
      </span>
    );
  };

  // Mock comprehensive intake data (in real app, this would come from API)
  const intakeData = {
    patientName: patient.name,
    email: patient.email || `${patient.name.toLowerCase().replace(' ', '.')}@patient.com`,
    intakeDate: patient.intakeDate,
    formType: patient.formType || "Intake",
    region: patient.region || "Lower Back",
    
    // Disability Index Arrays (mock data - would come from actual intake)
    ndi: patient.ndi || [2, 1, 3, 2, 1, 2, 3, 1, 2, 1], // Neck Disability Index
    odi: patient.odi || [3, 2, 2, 3, 2, 1, 2, 3, 2, 1], // Oswestry Disability Index  
    ulfi: patient.ulfi || Array(25).fill(0).map(() => Math.floor(Math.random() * 4)), // Upper Limb
    lefs: patient.lefs || Array(20).fill(0).map(() => Math.floor(Math.random() * 4)), // Lower Extremity
    
    // Pain and Function
    vas: patient.painScore || patient.pain,
    psfs: patient.psfs,
    
    // Cognitive Assessment
    beliefs: patient.beliefs || [
      "I worry my body is damaged or fragile",
      "I avoid movement because I fear it will make things worse"
    ],
    confidence: patient.confidence,
    
    // Follow-up specific
    groc: patient.groc || 0,
    
    // Calculated values
    disabilityPercentage: patient.disabilityIndex
  };

  // Helper function to get disability index name and questions
  const getDisabilityIndexInfo = (region) => {
    const indexMap = {
      "Neck": { 
        name: "NDI", 
        fullName: "Neck Disability Index",
        data: intakeData.ndi,
        questions: [
          "Pain Intensity", "Personal Care", "Lifting", "Reading", "Headaches",
          "Concentration", "Work", "Driving", "Sleeping", "Recreation"
        ]
      },
      "Lower Back": { 
        name: "ODI", 
        fullName: "Oswestry Disability Index",
        data: intakeData.odi,
        questions: [
          "Pain Intensity", "Personal Care", "Lifting", "Walking", "Sitting",
          "Standing", "Sleeping", "Sex Life", "Social Life", "Traveling"
        ]
      },
      "Upper Limb": { 
        name: "ULFI", 
        fullName: "Upper Limb Functional Index",
        data: intakeData.ulfi,
        questions: Array(25).fill(0).map((_, i) => `Activity ${i + 1}`)
      },
      "Lower Extremity": { 
        name: "LEFS", 
        fullName: "Lower Extremity Functional Scale",
        data: intakeData.lefs,
        questions: Array(20).fill(0).map((_, i) => `Activity ${i + 1}`)
      }
    };
    return indexMap[region] || indexMap["Lower Back"];
  };

  const disabilityInfo = getDisabilityIndexInfo(intakeData.region);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-charcoal-900 bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="relative card-gradient rounded-2xl shadow-2xl p-0 w-full max-w-4xl border border-btl-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-btl-600 to-btl-500 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">
                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold">{patient.name}</h2>
                <p className="text-btl-100 text-sm">Complete Intake Assessment & Recovery Progress</p>
              </div>
            </div>
            <button
              className="text-white hover:text-btl-100 text-3xl font-light transition-colors"
              onClick={onClose}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* SRS Score */}
            <div className="card-gradient rounded-xl p-4 border border-btl-200 text-center">
              <div className="flex flex-col items-center space-y-2">
                {srsBadge(patient.srs)}
                <div>
                  <div className="font-semibold text-charcoal-800">Signature Recovery Score™</div>
                  <div className="text-sm text-charcoal-600">Current Progress</div>
                </div>
              </div>
            </div>

            {/* Current Phase */}
            <div className={`rounded-xl p-4 border ${currentPhaseInfo.borderColor} ${currentPhaseInfo.bgColor} text-center`}>
              <div className="flex flex-col items-center space-y-2">
                <div className={`font-bold text-lg ${currentPhaseInfo.color}`}>{phase}</div>
                <div className="text-sm text-charcoal-600">Recovery Phase</div>
              </div>
            </div>

            {/* Follow-up Status */}
            <div className={`rounded-xl p-4 border text-center ${
              needsFollowUp(patient.lastUpdate) 
                ? "bg-gradient-to-r from-amber-100 to-amber-200 border-amber-300" 
                : "bg-gradient-to-r from-emerald-100 to-emerald-200 border-emerald-300"
            }`}>
              <div className="flex flex-col items-center space-y-2">
                <div className="text-3xl">
                  {needsFollowUp(patient.lastUpdate) ? "⏰" : "✅"}
                </div>
                <div>
                  <div className={`font-semibold ${
                    needsFollowUp(patient.lastUpdate) ? "text-amber-700" : "text-emerald-700"
                  }`}>
                    {needsFollowUp(patient.lastUpdate) ? "Follow-up Due" : "Up to Date"}
                  </div>
                  <div className="text-sm text-charcoal-600">Status</div>
                </div>
              </div>
            </div>
          </div>

          {/* Patient Demographics & Intake Info */}
          <div className="bg-gradient-to-r from-btl-50 to-white rounded-xl p-6 border border-btl-200">
            <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center">
              <span className="text-btl-600 mr-2">📋</span>
              Patient Demographics & Intake Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Patient Name:</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Email:</span>
                  <span className="font-semibold text-charcoal-800 text-xs">{intakeData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Form Type:</span>
                  <span className={`font-semibold px-2 py-1 rounded-full text-xs ${
                    intakeData.formType === "Intake" 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-green-100 text-green-800"
                  }`}>
                    {intakeData.formType}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Intake Date:</span>
                  <span className="font-semibold text-charcoal-800">
                    {format(new Date(patient.intakeDate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Last Update:</span>
                  <span className="font-semibold text-charcoal-800">
                    {format(new Date(patient.lastUpdate), "MMM dd, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Pain Region:</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.region}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-charcoal-600">VAS Pain Score:</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.vas}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">Confidence Level:</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.confidence}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-charcoal-600">GROC Score:</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.groc}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disability Index Assessment */}
          <div className="bg-gradient-to-r from-red-50 to-white rounded-xl p-6 border border-red-200">
            <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center">
              <span className="text-red-600 mr-2">📊</span>
              {disabilityInfo.fullName} ({disabilityInfo.name}) - {intakeData.disabilityPercentage}%
            </h3>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-charcoal-600">Overall Disability Level</span>
                <span className="font-semibold text-charcoal-800">{intakeData.disabilityPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-charcoal-200 rounded-full">
                <div 
                  className={`h-3 rounded-full ${
                    intakeData.disabilityPercentage >= 60 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                    intakeData.disabilityPercentage >= 40 ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
                    'bg-gradient-to-r from-emerald-400 to-emerald-500'
                  }`}
                  style={{ width: `${intakeData.disabilityPercentage}%` }}
                ></div>
              </div>
            </div>
            
            {/* Individual Question Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {disabilityInfo.questions.slice(0, 10).map((question, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-200">
                  <span className="font-medium text-charcoal-700 text-sm">{question}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-12 h-2 bg-charcoal-200 rounded-full">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-red-400 to-red-500"
                        style={{ width: `${(disabilityInfo.data[index] / 5) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-charcoal-800 min-w-[1.5rem] text-center text-sm">
                      {disabilityInfo.data[index]}/5
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PSFS Activities */}
          <div className="bg-gradient-to-r from-emerald-50 to-white rounded-xl p-6 border border-emerald-200">
            <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center">
              <span className="text-emerald-600 mr-2">🎯</span>
              Patient-Specific Functional Scale (PSFS)
            </h3>
            <div className="space-y-3">
              {patient.psfs.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-200">
                  <span className="font-medium text-charcoal-700">{item.activity}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-charcoal-200 rounded-full">
                      <div 
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500"
                        style={{ width: `${(item.score / 10) * 100}%` }}
                      ></div>
                    </div>
                    <span className="font-semibold text-charcoal-800 min-w-[2rem] text-center">
                      {item.score}/10
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-100 rounded-lg border border-emerald-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-emerald-800">Total PSFS Score:</span>
                <span className="font-bold text-emerald-800">
                  {patient.psfs.reduce((sum, item) => sum + item.score, 0)}/{patient.psfs.length * 10}
                </span>
              </div>
            </div>
          </div>

          {/* Beliefs Assessment */}
          <div className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center">
              <span className="text-purple-600 mr-2">🧠</span>
              Pain & Movement Beliefs Assessment
            </h3>
            
            {/* Belief Status Badge */}
            <div className="mb-4">
              <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                patient.beliefStatus === "Positive" 
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : patient.beliefStatus === "Neutral"
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-red-100 text-red-800 border border-red-300"
              }`}>
                {patient.beliefStatus === "Positive" ? "✅" : patient.beliefStatus === "Neutral" ? "➖" : "❌"}
                <span className="ml-2">Overall Status: {patient.beliefStatus}</span>
              </div>
            </div>

            {/* Individual Beliefs */}
            <div className="space-y-3">
              <h4 className="font-semibold text-charcoal-700 mb-2">Selected Belief Statements:</h4>
              {intakeData.beliefs.length > 0 ? (
                intakeData.beliefs.map((belief, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border border-purple-200">
                    <div className="flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm font-semibold">{index + 1}</span>
                    </div>
                    <span className="text-charcoal-700">{belief}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-emerald-100 rounded-lg border border-emerald-300 text-center">
                  <span className="text-emerald-800 font-semibold">✅ "None of these apply" - Positive belief profile</span>
                </div>
              )}
            </div>
          </div>

          {/* Recovery Progress Tracking */}
          <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center">
              <span className="text-blue-600 mr-2">📈</span>
              Recovery Progress Tracking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* SRS Progress */}
              <div className="space-y-3">
                <h4 className="font-semibold text-charcoal-700">SRS Score Progress</h4>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span className="text-charcoal-600">Previous SRS:</span>
                  <span className="font-semibold text-charcoal-800">{patient.prevSrs || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span className="text-charcoal-600">Current SRS:</span>
                  <span className="font-semibold text-charcoal-800">{patient.srs}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-100 rounded-lg border border-blue-300">
                  <span className="text-blue-700 font-semibold">SRS Change:</span>
                  <span className={`font-bold ${
                    (patient.srs - (patient.prevSrs || 0)) > 0 ? 'text-emerald-600' : 
                    (patient.srs - (patient.prevSrs || 0)) < 0 ? 'text-red-600' : 'text-charcoal-600'
                  }`}>
                    {patient.prevSrs ? (patient.srs - patient.prevSrs > 0 ? '+' : '') + (patient.srs - patient.prevSrs) : 'Baseline'}
                  </span>
                </div>
              </div>

              {/* Other Progress Metrics */}
              <div className="space-y-3">
                <h4 className="font-semibold text-charcoal-700">Key Outcome Measures</h4>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span className="text-charcoal-600">VAS Pain (0-10):</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.vas}/10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span className="text-charcoal-600">Confidence (0-10):</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.confidence}/10</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span className="text-charcoal-600">Disability Index:</span>
                  <span className="font-semibold text-charcoal-800">{intakeData.disabilityPercentage}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200">
                  <span className="text-charcoal-600">PSFS Total:</span>
                  <span className="font-semibold text-charcoal-800">
                    {patient.psfs.reduce((sum, item) => sum + item.score, 0)}/{patient.psfs.length * 10}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="bg-gradient-to-r from-btl-50 to-white rounded-xl p-6 border border-btl-200">
            <h3 className="text-lg font-semibold text-charcoal-800 mb-4 flex items-center">
              <span className="text-btl-600 mr-2">📝</span>
              Clinical Notes & Assessment
            </h3>
            
            {/* Existing Notes */}
            <div className="space-y-3 mb-4">
              {patient.notes.length > 0 ? (
                patient.notes.map((note, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border border-btl-200 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm text-charcoal-500">{note.timestamp}</span>
                    </div>
                    <p className="text-charcoal-700">{note.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-charcoal-500 italic text-center py-4">No clinical notes added yet</p>
              )}
            </div>

            {/* Add New Note */}
            <div className="border-t border-btl-200 pt-4">
              <div className="flex gap-3">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Add a clinical note about this patient's intake assessment or progress..."
                  className="flex-1 border border-btl-300 rounded-lg px-4 py-3 focus-ring resize-none"
                  rows="3"
                />
                <button
                  onClick={() => handleAddNote(patient.id)}
                  disabled={!noteInput.trim()}
                  className="btn-primary-gradient text-white px-6 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-lg"
                >
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientModal;
