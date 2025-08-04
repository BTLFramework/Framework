import React from "react";

export default function Beliefs({ formData, onChange }) {
  const beliefsList = [
    "I worry my body is damaged or fragile",
    "I avoid movement because I fear it will make things worse",
    "I'm afraid that moving might injure me more",
    "I was told something is 'out of place,' and it makes me cautious",
    "I don’t fully trust my body to handle activity",
    "I’ve been told to avoid certain postures or movements",
    "None of these apply",
  ];

  return (
    <section className="bg-white md:p-8 p-0 rounded">
      <h2 className="text-lg font-semibold mb-2">
        Beliefs About Pain & Movement
      </h2>
      <div className="space-y-2">
        {beliefsList.map((belief, idx) => (
          <label key={idx} className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="beliefs"
              value={belief}
              checked={formData.beliefs.includes(belief)}
              onChange={onChange}
              className="h-4 w-4 text-blue-600 border-2 border-gray-200 rounded"
            />
            <span className="text-sm text-gray-700">{belief}</span>
          </label>
        ))}
      </div>
    </section>
  );
}
