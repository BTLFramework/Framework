import React from "react";

export default function Confidence({ formData, onChange }) {
  return (
    <section className="bg-white md:p-8 p-0 rounded">
      <h2 className="text-lg font-semibold mb-2">Confidence</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confidence in Recovery: {formData.confidence}
        </label>
        <input
          type="range"
          name="confidence"
          min="0"
          max="10"
          value={formData.confidence}
          onChange={onChange}
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500 focus:outline-none"
        />
        <div className="flex justify-between text-xs text-gray-500">
          {Array.from({ length: 11 }, (_, i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
