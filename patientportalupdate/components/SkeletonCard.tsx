import { Clock } from "lucide-react";

interface SkeletonCardProps {
  title?: string;
  icon?: React.ReactNode;
}

export function SkeletonCard({ title = "Loading...", icon }: SkeletonCardProps) {
  return (
    <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-btl-100 min-h-[340px] min-w-[260px] animate-pulse">
      <div className="w-14 h-14 bg-btl-200 rounded-xl mb-4 mt-1 flex items-center justify-center">
        {icon || <div className="w-8 h-8 bg-btl-300 rounded" />}
      </div>
      <div className="h-6 bg-btl-200 rounded mb-1 w-32"></div>
      <div className="h-4 bg-btl-200 rounded mb-3 w-48"></div>
      <div className="h-5 bg-btl-200 rounded mb-3 w-24"></div>
      <div className="h-5 bg-btl-200 rounded mb-2 w-16"></div>
      <div className="h-4 bg-btl-200 rounded mb-2 w-20"></div>
      <div className="h-4 bg-btl-200 rounded mt-auto w-16"></div>
    </div>
  );
} 