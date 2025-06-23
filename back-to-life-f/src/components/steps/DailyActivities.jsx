import React from "react";

export default function DailyActivities({ formData, onChange }) {
  return (
    <section className="bg-white md:p-8 p-0 rounded space-y-4">
      <h2 className="text-lg font-semibold mb-2">Daily Activities (PSFS)</h2>
      {formData.psfs.map((item, index) => (
        <div key={index} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Activity {index + 1}
          </label>
          <input
            type="text"
            value={item.activity}
            onChange={(e) => onChange(index, "activity", e.target.value)}
            className="block w-full border border-gray-200 rounded-md p-2"
          />
          <label className="block text-sm text-gray-600">
            How well can you currently perform this activity?:
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={item.score}
            onChange={(e) => onChange(index, "score", Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i}>{i}</span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
