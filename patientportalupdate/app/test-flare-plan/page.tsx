"use client";

import { useState } from "react";
import FlarePlan, { FlarePlanData } from "@/components/FlarePlan";
import InsightDialog from "@/components/InsightDialog";
import { useAuth } from "@/hooks/useAuth";

export default function TestFlarePlanPage() {
  const { patient } = useAuth();
  const [flareData, setFlareData] = useState<FlarePlanData | null>(null);
  const [showInsightDialog, setShowInsightDialog] = useState(false);

  const handleComplete = (data: FlarePlanData) => {
    console.log("Flare plan completed:", data);
    setFlareData(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Flare Plan Test</h1>
          <p className="text-gray-600">Testing the FlarePlan component with Back-to-Life styling</p>
        </div>
        
        {/* Test buttons */}
        <div className="mb-8 space-y-4">
          <button
            onClick={() => setShowInsightDialog(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Test Flare Plan Insight (ID 28)
          </button>
        </div>
        
        <FlarePlan 
          id="test-flare-plan" 
          onComplete={handleComplete}
        />

        {flareData && (
          <div className="mt-8 p-6 bg-white rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Completed Flare Plan Data:</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(flareData, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Test InsightDialog */}
      {showInsightDialog && (
        <InsightDialog
          insightId={28}
          isOpen={showInsightDialog}
          onClose={() => setShowInsightDialog(false)}
          patientId={patient?.email || ""}
          onComplete={(insightId, points) => {
            console.log('🎯 Insight completed:', { insightId, points });
            setShowInsightDialog(false);
          }}
        />
      )}
    </div>
  );
} 