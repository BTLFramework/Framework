"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, CheckCircle, FileText, Video, Image, Lock } from "lucide-react";
import { Insight } from "@/lib/InsightLibrary";
import { clsx } from "clsx";

interface InsightCardProps {
  insight: Insight;
  isCompleted?: boolean;
  isToday?: boolean;
  isFuture?: boolean;
  offset?: number;
  onOpen: (insightId: number) => void;
}

export default function InsightCard({ 
  insight, 
  isCompleted = false, 
  isToday = false,
  isFuture = false,
  offset = 0,
  onOpen 
}: InsightCardProps) {
  const getAssetIcon = (assetPath: string) => {
    if (assetPath.startsWith("FORM:")) {
      return <FileText className="h-5 w-5" />;
    }
    if (assetPath.endsWith('.mp4')) {
      return <Video className="h-5 w-5" />;
    }
    if (assetPath.endsWith('.json')) {
      return <Image className="h-5 w-5" />;
    }
    return <Play className="h-5 w-5" />;
  };

  const getTrackColor = (track: string) => {
    const colors = {
      PainScience: "bg-red-100 text-red-800 border-red-200",
      StressMood: "bg-blue-100 text-blue-800 border-blue-200",
      Lifestyle: "bg-green-100 text-green-800 border-green-200",
      SuccessStory: "bg-purple-100 text-purple-800 border-purple-200",
      SelfEfficacy: "bg-orange-100 text-orange-800 border-orange-200",
      Recap: "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
    return colors[track as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <Card className={clsx(
      "relative transition-all duration-200 rounded-2xl shadow-md border-2",
      isCompleted && 'bg-green-50 border-green-200',
      isToday && 'border-cyan-500',
      isFuture && 'opacity-70',
      !isFuture && 'hover:shadow-xl hover:scale-[1.03] cursor-pointer',
      isFuture && 'pointer-events-none',
      !isToday && !isCompleted && !isFuture && 'border-gray-200'
    )}>
      {isCompleted && (
        <CheckCircle className="absolute top-2 right-2 w-5 h-5 text-green-500" />
      )}
      {isFuture && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] flex items-center justify-center rounded-2xl pointer-events-none z-10">
          <Lock className="w-4 h-4 text-gray-500" />
          <span className="ml-1 text-sm text-gray-600">Day&nbsp;{offset + 1}</span>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getAssetIcon(insight.assetPath)}
            <Badge 
              variant="outline" 
              className={`text-xs ${getTrackColor(insight.track)}`}
            >
              {insight.track}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">
          {insight.title}
        </CardTitle>
        <CardDescription className="text-sm">
          {insight.subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Button 
          onClick={() => !isFuture && onOpen(insight.id)}
          variant={isCompleted ? "outline" : "default"}
          className={clsx(
            "w-full rounded-xl py-2 font-semibold transition-all duration-200",
            isFuture ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : '',
            isCompleted ? 'border-green-200 text-green-700' : '',
            isToday ? 'bg-cyan-500 text-white hover:bg-cyan-600' : '',
            !isFuture && !isToday && !isCompleted ? 'bg-btl-50 text-btl-800 hover:bg-btl-100' : ''
          )}
          disabled={isFuture}
        >
          {isCompleted ? "Review" : isFuture ? "Locked" : "Start Insight"}
        </Button>
      </CardContent>
    </Card>
  );
} 