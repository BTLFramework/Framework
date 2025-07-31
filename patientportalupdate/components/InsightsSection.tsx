"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Filter, Trophy, Lock, CheckCircle } from "lucide-react";
import { insightLibrary, getAllTracks, getInsightsByTrack } from "@/lib/InsightLibrary";
import InsightCard from "./InsightCard";
import InsightDialog from "./InsightDialog";

interface InsightsSectionProps {
  completedInsights?: number[];
  onInsightComplete?: (insightId: number, points?: number) => void;
}

export default function InsightsSection({ 
  completedInsights = [], 
  onInsightComplete 
}: InsightsSectionProps) {
  const [selectedInsightId, setSelectedInsightId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("all");
  const [todayInsightIndex, setTodayInsightIndex] = useState(0);
  const [patientId, setPatientId] = useState<string>("");

  useEffect(() => {
    // Load patientId (email) from localStorage
    try {
      const stored = localStorage.getItem('btl_patient_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) setPatientId(parsed.email);
      }
    } catch {}
  }, []);

  const tracks = getAllTracks();
  const totalInsights = insightLibrary.length;
  const completedCount = completedInsights.length;
  const completionRate = totalInsights > 0 ? Math.round((completedCount / totalInsights) * 100) : 0;

  // Calculate today's insight based on date (rotates daily)
  useEffect(() => {
    const today = new Date();
    const startDate = new Date('2024-01-01'); // Arbitrary start date
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const todayIndex = daysSinceStart % totalInsights;
    setTodayInsightIndex(todayIndex);
  }, [totalInsights]);

  const handleOpenInsight = (insightId: number) => {
    setSelectedInsightId(insightId);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedInsightId(null);
  };

  const handleInsightComplete = (insightId: number, points?: number) => {
    onInsightComplete?.(insightId, points);
  };

  const getFilteredInsights = () => {
    let insights = insightLibrary;

    // Filter by track
    if (selectedTrack !== "all") {
      insights = getInsightsByTrack(selectedTrack);
    }

    // Filter by completion status based on active tab
    if (activeTab === "completed") {
      insights = insights.filter(insight => completedInsights.includes(insight.id));
    } else if (activeTab === "incomplete") {
      insights = insights.filter(insight => !completedInsights.includes(insight.id));
    }

    return insights;
  };

  const getInsightStatus = (index: number) => {
    const today = new Date();
    const startDate = new Date('2024-01-01');
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentDayIndex = daysSinceStart % totalInsights;
    
    // Calculate offset (days from today)
    let offset: number;
    if (index >= currentDayIndex) {
      offset = index - currentDayIndex;
    } else {
      // For past insights, calculate negative offset
      offset = -(totalInsights - currentDayIndex + index);
    }
    
    const isToday = offset === 0;
    const isFuture = offset > 0;
    const isCompleted = offset < 0 || completedInsights.includes(insightLibrary[index]?.id);
    
    return { 
      isToday, 
      isFuture, 
      isCompleted,
      offset
    };
  };

  const filteredInsights = getFilteredInsights();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold">Recovery Insights</h2>
            <p className="text-gray-600">
              Evidence-based content to support your recovery journey
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="text-sm font-medium">
            {completedCount}/{totalInsights} completed ({completionRate}%)
          </span>
        </div>
      </div>

      {/* Progress Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-blue-900">Your Progress</h3>
              <p className="text-blue-700 text-sm">
                Keep learning to unlock more insights
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-900">{completionRate}%</div>
              <div className="text-sm text-blue-700">Complete</div>
            </div>
          </div>
          <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Insights</TabsTrigger>
            <TabsTrigger value="incomplete">To Complete</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <Select value={selectedTrack} onValueChange={setSelectedTrack}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by track" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tracks</SelectItem>
              {tracks.map(track => (
                <SelectItem key={track} value={track}>
                  {track}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Insights Grid */}
      {filteredInsights.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInsights.map((insight, index) => {
            const status = getInsightStatus(index);
            return (
              <InsightCard
                key={insight.id}
                insight={insight}
                isCompleted={status.isCompleted}
                isToday={status.isToday}
                isFuture={status.isFuture}
                offset={status.offset}
                onOpen={handleOpenInsight}
              />
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-gray-500">
              {activeTab === "completed" 
                ? "No completed insights yet. Start learning to see your progress!"
                : "No insights match your current filters."
              }
            </div>
          </CardContent>
        </Card>
      )}

      {/* Insight Dialog */}
      {selectedInsightId && (
        <InsightDialog
          insightId={selectedInsightId}
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          onComplete={handleInsightComplete}
          patientId={patientId}
        />
      )}
    </div>
  );
} 