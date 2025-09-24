import { Brain, Clock } from "lucide-react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
import { SkeletonCard } from "./SkeletonCard";

interface MindfulnessSessionCardProps {
  patientId: string;
  onClick: () => void;
  isOpen?: boolean;
}

export function MindfulnessSessionCard({ patientId, onClick, isOpen = false }: MindfulnessSessionCardProps) {
  const { data, error, isLoading } = usePatientRecoveryData(patientId, 'mindfulness', isOpen);

  // Show skeleton only when data is undefined (matching PainAssessmentCard logic)
  if (data === undefined) {
    return <SkeletonCard title="Mindfulness Session" icon={<Brain className="w-8 h-8 text-btl-400" />} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-red-200 min-h-[340px] min-w-[260px]">
        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 mt-1">
          <Brain className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg mb-1 text-center text-red-700">Mindfulness Session</h3>
        <p className="text-[15px] mb-3 text-center text-red-600">Unable to load session data</p>
        <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 mb-3 text-center">Error loading data</span>
        <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-red-200 text-red-800 mb-2">+0 pts</span>
        <div className="flex items-center justify-center text-xs text-red-600/70 mt-auto">
          <Clock className="w-4 h-4 mr-1" />--
        </div>
      </div>
    );
  }

  const mindfulnessData = (data as any)?.mindfulness || {};
  const lastSession = mindfulnessData.lastSession;
  const phase = mindfulnessData.phase || 'EDUCATE';
  const availableTracks = mindfulnessData.availableTracks || 3;
  const points = 5;
  // Pills styling (silver for mindfulness)
  const pillClass = 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-white shadow border border-gray-400';

  return (
    <div
      className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-btl-100 hover:shadow-xl hover:border-btl-200 transition-all duration-200 cursor-pointer relative group min-h-[340px] min-w-[260px]"
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-btl-600 rounded-xl flex items-center justify-center mb-4 mt-1 shadow-md">
        <Brain className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-bold text-lg mb-1 text-center text-btl-900">Mindfulness Session</h3>
      <p className="text-[15px] mb-3 text-center text-btl-700">
        {lastSession ? "Continue your mindfulness practice" : "Complete guided breathing exercise for mental wellness"}
      </p>
      <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-btl-100 text-btl-600 mb-3 text-center whitespace-nowrap">
        {availableTracks} tracks available • {phase.toUpperCase()} phase
      </span>
      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${pillClass} mb-2`}>
        +{points} pts
      </span>
      <div className="text-btl-700 font-semibold text-sm underline flex items-center gap-1 mb-2 hover:text-btl-800">
        {lastSession ? "Continue Session" : "Begin Session"}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <div className="flex items-center justify-center text-xs text-btl-500 mt-auto">
        <Clock className="w-4 h-4 mr-1" />10 min
      </div>
    </div>
  );
} 