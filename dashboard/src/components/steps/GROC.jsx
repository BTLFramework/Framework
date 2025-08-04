import React from "react";

/**
 * Only shown when formType === "Follow-Up".
 */
export default function GROC({ formData, onChange }) {
  return (
    <section className="bg-white md:p-8 p-0 rounded">
      <h2 className="text-lg font-semibold mb-2">
        Global Rating of Change (GROC)
      </h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Compared to when you started care, how would you describe your
          condition now? ({formData.groc})
        </label>
        <input
          type="range"
          name="groc"
          min="-7"
          max="7"
          value={formData.groc}
          onChange={onChange}
          className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer accent-blue-500 focus:outline-none"
        />
        <div className="flex justify-between text-xs text-gray-500">
          {Array.from({ length: 15 }, (_, i) => i - 7).map((v) => (
            <span key={v}>{v}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
