import Link from 'next/link'

export default function PatientPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Patient Portal</h1>
          <p className="text-gray-600 mb-6">
            Access your recovery tools, track progress, and manage your treatment plan.
          </p>
          
          <div className="space-y-4">
            <Link 
              href="https://patientportalupdate.vercel.app"
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors block"
            >
              Access Patient Portal
            </Link>
            
            <Link 
              href="/"
              className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-colors block"
            >
              Back to Home
            </Link>
          </div>
          
          <p className="text-sm text-gray-500 mt-6">
            This will open the full patient portal in a new window
          </p>
        </div>
      </div>
    </div>
  )
} 