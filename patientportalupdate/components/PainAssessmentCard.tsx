import { Heart, Clock } from "lucide-react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
import { SkeletonCard } from "./SkeletonCard";

interface PainAssessmentCardProps {
  patientId: string;
  onClick: () => void;
  isOpen?: boolean;
}

export function PainAssessmentCard({ patientId, onClick, isOpen = false }: PainAssessmentCardProps) {
  const { data, error, isLoading } = usePatientRecoveryData(patientId, 'pain', isOpen);

  // Show skeleton only when data is undefined (matching MovementSessionCard logic)
  if (data === undefined) {
    return <SkeletonCard title="Pain Assessment" icon={<Heart className="w-8 h-8 text-btl-400" />} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-red-200 min-h-[340px] min-w-[260px]">
        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-4 mt-1">
          <Heart className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="font-bold text-lg mb-1 text-center text-red-700">Pain Assessment</h3>
        <p className="text-[15px] mb-3 text-center text-red-600">Unable to load assessment data</p>
        <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-600 mb-3 text-center">Error loading data</span>
        <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-red-200 text-red-800 mb-2">+0 pts</span>
        <div className="flex items-center justify-center text-xs text-red-600/70 mt-auto">
          <Clock className="w-4 h-4 mr-1" />--
        </div>
      </div>
    );
  }

  const painData = (data as any)?.pain || {};
  const lastAssessment = painData.lastAssessment;
  const phase = painData.phase || 'EDUCATE';
  const points = 3; // Form submitted on time - matches backend config

  // Pills styling (bronze for pain)
  const pillClass = 'bg-gradient-to-r from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142]';

  return (
    <div
      className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-btl-100 hover:shadow-xl hover:border-btl-200 transition-all duration-200 cursor-pointer relative group min-h-[340px] min-w-[260px]"
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-btl-600 rounded-xl flex items-center justify-center mb-4 mt-1 shadow-md">
        <Heart className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-bold text-lg mb-1 text-center text-btl-900">Pain Assessment</h3>
      <p className="text-[15px] mb-3 text-center text-btl-700">
        {lastAssessment ? "Update your pain levels and track patterns" : "Rate your current pain levels and track patterns"}
      </p>
      <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-btl-100 text-btl-600 mb-3 text-center whitespace-nowrap">
        {lastAssessment ? "Daily check-in" : "New assessment"} • {phase.toUpperCase()} phase
      </span>
      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${pillClass} mb-2`}>
        +{points} pts
      </span>
      <div className="text-btl-700 font-semibold text-sm underline flex items-center gap-1 mb-2 hover:text-btl-800">
        {lastAssessment ? "Update Assessment" : "Begin Assessment"}
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <div className="flex items-center justify-center text-xs text-btl-500 mt-auto">
        <Clock className="w-4 h-4 mr-1" />3 min
      </div>
    </div>
  );
} 