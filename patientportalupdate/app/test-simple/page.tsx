"use client";

export default function TestSimplePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-btl-900">Back-to-Life Color Test</h1>
        
        {/* Test gradient header */}
        <div className="bg-gradient-to-br from-btl-600 to-btl-700 p-8 rounded-2xl shadow-xl">
          <h2 className="text-2xl font-bold text-white">Gradient Header Test</h2>
          <p className="text-btl-100 mt-2">This should show the Back-to-Life blue gradient</p>
        </div>

        {/* Test cards */}
        <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-btl-900 mb-4">Card Test</h3>
          <p className="text-btl-800">This should show a light blue card with proper text colors</p>
        </div>

        {/* Test buttons */}
        <div className="space-y-4">
          <button className="px-6 py-3 bg-btl-600 hover:bg-btl-700 text-white rounded-xl font-medium">
            Primary Button
          </button>
          <button className="px-6 py-3 border-2 border-btl-200 text-btl-700 hover:bg-btl-50 rounded-xl font-medium">
            Secondary Button
          </button>
        </div>

        {/* Test badges */}
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-btl-600 text-white rounded-full text-sm">Badge 1</span>
          <span className="px-3 py-1 bg-btl-100 text-btl-800 border border-btl-200 rounded-full text-sm">Badge 2</span>
        </div>

        {/* Test form elements */}
        <div className="space-y-4">
          <input 
            type="text" 
            placeholder="Test input" 
            className="w-full p-3 border border-btl-200 rounded-xl focus:border-btl-400 focus:ring-btl-400"
          />
          <textarea 
            placeholder="Test textarea" 
            className="w-full p-3 border border-btl-200 rounded-xl focus:border-btl-400 focus:ring-btl-400 min-h-[100px]"
          />
        </div>
      </div>
    </div>
  );
} 