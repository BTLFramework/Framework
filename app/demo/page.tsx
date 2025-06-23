import React from 'react';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 to-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">
            Intake Form → Dual Portal Integration
          </h1>
          <p className="text-charcoal-600">
            Complete intake automatically populates both patient and clinician portals
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Patient Portal Preview */}
          <div className="card-gradient rounded-xl p-6 border border-btl-200">
            <h2 className="text-xl font-bold gradient-text mb-4">Patient Portal</h2>
                      <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-btl-50">
              <span className="font-medium">SRS Score</span>
              <span className="px-3 py-1 rounded-full badge-gold">9/11</span>
            </div>
            <div className="p-3 rounded-lg bg-btl-50">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Current Phase</span>
                <span className="text-btl-700 font-semibold">REBUILD</span>
              </div>
              <p className="text-sm text-charcoal-600">
                Functional integration, strength progression, and resilience training — built to last beyond the clinic.
              </p>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-btl-50">
              <span className="font-medium">Recovery Points</span>
              <span className="text-btl-600 font-semibold">22/30</span>
            </div>
          </div>
          </div>

          {/* Clinician Portal Preview */}
          <div className="card-gradient rounded-xl p-6 border border-btl-200">
            <h2 className="text-xl font-bold gradient-text mb-4">Clinician Portal</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-amber-50">
                <span className="font-medium">Phase Transition</span>
                <span className="px-3 py-1 rounded-full bg-amber-200 text-amber-800">Review</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <span className="font-medium">Milestone Eligible</span>
                <span className="text-green-700 font-semibold">Yes</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <span className="font-medium">Clinical Verification</span>
                <span className="text-blue-700 font-semibold">Pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Form */}
        <div className="mt-8 card-gradient rounded-xl p-6 border border-btl-200">
          <h3 className="text-lg font-bold gradient-text mb-4">Intake Form Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                className="w-full p-3 border border-btl-200 rounded-lg"
                placeholder="Sarah Johnson"
                defaultValue="Sarah Johnson"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                VAS Score
              </label>
              <input
                type="number"
                className="w-full p-3 border border-btl-200 rounded-lg"
                placeholder="6"
                defaultValue="6"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal-700 mb-2">
                Confidence Level
              </label>
              <input
                type="number"
                className="w-full p-3 border border-btl-200 rounded-lg"
                placeholder="7"
                defaultValue="7"
              />
            </div>
          </div>
          
          <button className="mt-6 w-full btn-primary-gradient text-white py-3 rounded-lg font-semibold">
            ✅ Submit to Both Portals
          </button>
          
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <span className="text-green-600">✅</span>
              <span className="text-green-800 font-medium">Successfully integrated!</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Patient portal updated with personalized dashboard • Clinician notified of phase transition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 