import { useAssignedExercises } from "@/hooks/useAssignedExercises";
import { useAuth } from "@/hooks/useAuth";
import { Dumbbell, Clock } from "lucide-react";

interface MovementSessionCardProps {
  onClick: () => void;
}

export function MovementSessionCard({ onClick }: MovementSessionCardProps) {
  // Get authenticated patient data
  const { patient, loading: authLoading, isAuthenticated } = useAuth();
  
  // Fetch assigned exercises from backend using authenticated patient email
  const { data: exerciseData, error: exerciseError, loading: exerciseLoading } = useAssignedExercises(patient?.email || '');
  
  // Mock data fallback for when patient doesn't exist in database
  const mockExerciseData = {
    exercises: [
      { id: 1, name: "Neck Stretch", difficulty: "Easy", points: 3 },
      { id: 2, name: "Shoulder Rolls", difficulty: "Easy", points: 3 },
      { id: 3, name: "Gentle Rotation", difficulty: "Easy", points: 3 }
    ],
    totalPoints: 9,
    region: "Neck",
    phase: "Educate",
    srsScore: 4
  };
  
  // Show skeleton while loading authentication or exercises
  if (authLoading || (exerciseData === undefined && exerciseLoading)) {
    return (
      <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-btl-100 min-h-[340px] min-w-[260px] animate-pulse">
        <div className="w-14 h-14 bg-btl-200 rounded-xl mb-4 mt-1"></div>
        <div className="h-6 bg-btl-200 rounded mb-1 w-32"></div>
        <div className="h-4 bg-btl-200 rounded mb-3 w-48"></div>
        <div className="h-5 bg-btl-200 rounded mb-3 w-24"></div>
        <div className="h-5 bg-btl-200 rounded mb-2 w-16"></div>
        <div className="h-4 bg-btl-200 rounded mb-2 w-20"></div>
        <div className="h-4 bg-btl-200 rounded mt-auto w-16"></div>
      </div>
    );
  }
  
  // Use mock data if there's an error (like patient not found) or no data
  const finalExerciseData = exerciseData || mockExerciseData;
  const exercises = finalExerciseData?.exercises || [];
  const totalPoints = finalExerciseData?.totalPoints || 9;
  const phase = finalExerciseData?.phase || 'EDUCATE';
  
  // Define metallic pill classes for Movement Session (gold theme)
  const metallicPills = {
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow border border-yellow-500 rounded-full',
    silver: 'bg-gradient-to-br from-btl-800 via-btl-600 to-btl-200 text-white shadow border border-btl-500 rounded-full',
    bronze: 'bg-gradient-to-br from-btl-700 via-btl-500 to-btl-300 text-white shadow border border-btl-400 rounded-full',
  };
  
  // Determine points pill color based on total points
  const getPointsPill = (points: number) => {
    if (points >= 10) return metallicPills.gold;
    if (points >= 7) return metallicPills.silver;
    return metallicPills.bronze;
  };
  
  // Estimate session time based on number of exercises
  const getSessionTime = (exerciseCount: number) => {
    if (exerciseCount <= 2) return "10-15 min";
    if (exerciseCount <= 3) return "15-20 min";
    return "20-25 min";
  };
  
  return (
    <div
      className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-btl-100 hover:shadow-xl hover:border-btl-200 transition-all duration-200 cursor-pointer relative group min-h-[340px] min-w-[260px]"
      onClick={onClick}
    >
      <div className="w-14 h-14 bg-btl-600 rounded-xl flex items-center justify-center mb-4 mt-1 shadow-md">
        <Dumbbell className="w-8 h-8 text-white" />
      </div>
      <h3 className="font-bold text-lg mb-1 text-center text-black">Movement Session</h3>
      <p className="text-[15px] mb-3 text-center text-black">
        {exercises.length} exercises personalized for your recovery
      </p>
      <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-btl-100 text-btl-600 mb-3 text-center whitespace-nowrap">
        {exercises.length} exercises • {phase.toUpperCase()} phase
      </span>
      <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${getPointsPill(totalPoints)} mb-2`}>
        +{totalPoints} pts
      </span>
      <div className="text-btl-600 font-semibold text-sm underline flex items-center gap-1 mb-2 hover:text-btl-700">
        Begin Session
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
      <div className="flex items-center justify-center text-xs text-btl-600/70 mt-auto">
        <Clock className="w-4 h-4 mr-1" />
        {getSessionTime(exercises.length)}
      </div>
    </div>
  );
} 