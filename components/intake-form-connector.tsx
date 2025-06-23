"use client"

import React, { useState } from 'react'

export function IntakeFormConnector() {
  const [formData, setFormData] = useState({
    patientName: '',
    email: '',
    region: '',
    vas: 0,
    confidence: 0,
    psfs: [
      { activity: 'Computer work', score: 0 },
      { activity: 'Driving', score: 0 },
      { activity: 'Sleeping', score: 0 }
    ],
    beliefs: []
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      setResult(data)
      
      if (data.success) {
        console.log('✅ Form submitted successfully:', data)
      }
    } catch (error) {
      console.error('❌ Form submission error:', error)
      setResult({ success: false, error: 'Submission failed' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 back-to-life-gradient bg-clip-text text-transparent">
          Intake Form Integration Test
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Patient Name</label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                placeholder="Enter patient name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Pain Region</label>
            <input
              type="text"
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              placeholder="e.g., Neck, Lower Back"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Pain Level (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.vas}
                onChange={(e) => setFormData({...formData, vas: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Confidence Level (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                value={formData.confidence}
                onChange={(e) => setFormData({...formData, confidence: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full btn-primary-gradient text-white py-3 px-6 rounded-md font-medium disabled:opacity-50"
          >
            {isSubmitting ? 'Processing...' : 'Submit Intake Form'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className={`text-xl font-bold mb-4 ${result.success ? 'text-green-600' : 'text-red-600'}`}>
            {result.success ? '✅ Integration Success' : '❌ Integration Error'}
          </h3>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
} 