import React from "react";

export default function PhaseFlow({ resultPhase }) {
  const isResetActive = ["RESET", "EDUCATE", "REBUILD"].includes(
    resultPhase.label
  );
  const isEducateActive = ["EDUCATE", "REBUILD"].includes(resultPhase.label);
  const isRebuildActive = resultPhase.label === "REBUILD";

  return (
    <>
      <div className="flex items-center justify-center mb-4">
        {/* RESET */}
        <div
          className={`
            relative flex items-center font-semibold md:h-12 h-10 md:pl-6 pl-4 md:pr-12 pr-8
            ${
              isResetActive
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }
          `}
        >
          RESET
          {/* Triangle tip */}
          <div
            className={`
              absolute top-0 right-0 w-0 h-0 md:border-y-24 border-y-20 md:border-l-24 border-l-12
              ${isEducateActive ? "text-blue-500" : "text-gray-300"}
              ${isResetActive ? "border-l-blue-500" : "border-l-gray-300"}
            `}
          />
        </div>

        {/* EDUCATE */}
        <div
          className={`
            relative flex items-center font-semibold md:h-12 h-10 md:pl-6 pl-4 md:pr-12 pr-8
            ${
              isEducateActive
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }
          `}
        >
          EDUCATE
          <div
            className={`
              absolute top-0 right-0 w-0 h-0 md:border-y-24 border-y-20 md:border-l-24 border-l-12
              ${isRebuildActive ? "text-blue-500" : "text-gray-300"}
              ${isEducateActive ? "border-l-blue-500" : "border-l-gray-300"}
            `}
          />
        </div>

        {/* REBUILD */}
        <div
          className={`
            relative flex items-center font-semibold md:h-12 h-10 md:pl-6 pl-4 md:pr-12 pr-8
            ${
              isRebuildActive
                ? "bg-blue-500 text-white"
                : "bg-gray-300 text-gray-700"
            }
          `}
        >
          REBUILD
          <div
            className={`
              absolute top-0 right-0 w-0 h-0 md:border-y-24 border-y-20 md:border-l-24 border-l-12 text-white
              ${
                isRebuildActive
                  ? "border-l-blue-500 text-white"
                  : "border-l-gray-300"
              }
            `}
          />
        </div>
      </div>
      {/* Tagline below */}
      <div className="text-center text-sm text-gray-700 italic mb-8">
        {resultPhase.label === "RESET" &&
          "Based on your answers, you are currently in the RESET phase. We’ll focus on pain relief and reintroducing gentle movement."}
        {resultPhase.label === "EDUCATE" &&
          "Based on your answers, you are currently in the EDUCATE phase. We’ll focus on helping you understand your symptoms and develop strategies to manage them confidently."}
        {resultPhase.label === "REBUILD" &&
          "Based on your answers, you are currently in the REBUILD phase. We’ll work on restoring strength, improving function, and building long-term resilience."}
      </div>
    </>
  );
}
