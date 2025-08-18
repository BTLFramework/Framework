import { useState, useEffect } from "react";
import type { RecoveryInsight } from "@/types/recovery";

// Comprehensive insight library organized by patient characteristics
const insightLibrary: RecoveryInsight[] = [
  // Pain Science Insights (for high pain scores)
  {
    id: "21",
    title: "Danger vs. safety signals",
    description: "How your brain turns pain up or down",
    category: "Pain Science",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { minVAS: 4, minPCS4: 0 }
  },
  {
    id: "23", 
    title: "Pain is not tissue damage",
    description: "Understanding the difference between pain and harm",
    category: "Pain Science",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { minVAS: 6, minFearAvoidance: 30 }
  },
  
  // Stress & Mood Insights (for high catastrophizing/stress)
  {
    id: "22",
    title: "How cortisol slows healing",
    description: "Stress and tissue repair",
    category: "Stress & Mood",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { minPCS4: 8, minStress: 2 }
  },
  {
    id: "24",
    title: "Breaking the stress-pain cycle",
    description: "How stress amplifies pain perception",
    category: "Stress & Mood", 
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { minPCS4: 10, minStress: 3 }
  },
  
  // Movement & Fear Insights (for high fear-avoidance)
  {
    id: "25",
    title: "Movement is medicine",
    description: "Why gentle movement helps healing",
    category: "Movement",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { minFearAvoidance: 25, minVAS: 3 }
  },
  {
    id: "26",
    title: "Overcoming fear of movement",
    description: "Building confidence in your body's resilience",
    category: "Movement",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { minFearAvoidance: 30, maxConfidence: 5 }
  },
  
  // Self-Efficacy Insights (for low confidence)
  {
    id: "28",
    title: "Flare Up Plan",
    description: "Build your personalized flare up plan to stay in control when symptoms spike.",
    category: "Self Efficacy",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { maxConfidence: 6, minVAS: 4 }
  },
  {
    id: "27",
    title: "Building recovery confidence",
    description: "Evidence-based strategies to boost self-efficacy",
    category: "Self Efficacy",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { maxConfidence: 5, minPCS4: 6 }
  },
  
  // Positive Insights (for high-performing patients)
  {
    id: "29",
    title: "Maintaining your progress",
    description: "Strategies to stay on track during good days",
    category: "Progress",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { maxVAS: 3, minConfidence: 7, maxPCS4: 6 }
  },
  {
    id: "30",
    title: "Graduation preparation",
    description: "Preparing for life beyond structured recovery",
    category: "Progress",
    date: new Date().toISOString(),
    points: 5,
    viewed: false,
    completed: false,
    conditions: { maxVAS: 2, minConfidence: 8, maxPCS4: 4, maxFearAvoidance: 20 }
  }
];

/**
 * Personalizes insights based on patient data from intake form
 * @param patientData Full patient data including intake assessments
 */
function personalizeInsights(patientData: any): RecoveryInsight[] {
  if (!patientData) return insightLibrary.slice(0, 3); // Default fallback
  
  console.log('🎯 Personalizing insights for patient data:', {
    vas: patientData.vas,
    pcs4: patientData.pcs4,
    tsk11: patientData.tsk11,
    confidence: patientData.confidence
  });
  
  // Calculate patient metrics from intake data
  const vas = parseInt(patientData.vas) || 0;
  const confidence = parseInt(patientData.confidence) || 0;
  
  // Calculate PCS-4 total (pain catastrophizing)
  let pcs4Total = 0;
  if (patientData.pcs4 && typeof patientData.pcs4 === 'object') {
    pcs4Total = Object.values(patientData.pcs4).reduce((sum: number, val: any) => sum + (parseInt(val) || 0), 0);
  }
  
  // Calculate TSK-11 fear-avoidance score with reverse scoring
  let fearAvoidanceScore = 0;
  if (patientData.tsk11 && typeof patientData.tsk11 === 'object') {
    const reverseScoredItems = [4, 8, 9];
    let rawScore = 0;
    let answeredCount = 0;
    
    for (let i = 1; i <= 11; i++) {
      const response = patientData.tsk11[i];
      if (response !== undefined && response >= 0 && response <= 4) {
        answeredCount++;
        if (reverseScoredItems.includes(i)) {
          rawScore += (5 - response); // Reverse score
        } else {
          rawScore += response;
        }
      }
    }
    
    if (answeredCount === 11) {
      fearAvoidanceScore = Math.round(((rawScore - 11) / 33) * 100); // Convert to 0-100 scale
    }
  }
  
  // Get current pain and stress from daily assessments
  const [currentPain, setCurrentPain] = useState(vas);
  const [recentStress, setRecentStress] = useState(2);
  
  // Fetch latest daily assessment data
  useEffect(() => {
    const fetchDailyData = async () => {
      if (!patientData.patient?.email) return;
      
      try {
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://backend-production-3545.up.railway.app';
        const response = await fetch(`${backendUrl}/patients/daily-data/${patientData.patient.email}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Convert 0-100 scale back to 0-10 for display
            const dailyPain = Math.round((result.data.pain / 100) * 10);
            const dailyStress = Math.round((result.data.psychLoad / 100) * 10);
            
            setCurrentPain(dailyPain);
            setRecentStress(dailyStress);
            
            console.log('📈 Updated with daily assessment data:', {
              pain: `${vas} → ${dailyPain}`,
              stress: `2 → ${dailyStress}`
            });
          }
        }
      } catch (error) {
        console.log('⚠️ Could not fetch daily data, using baseline values');
      }
    };
    
    fetchDailyData();
  }, [patientData.patient?.email, vas]);
  
  console.log('📊 Patient metrics calculated:', {
    baseline: { vas, pcs4Total, fearAvoidanceScore, confidence },
    current: { pain: currentPain, stress: recentStress }
  });
  
  // Filter insights based on patient conditions (use current pain over baseline VAS)
  const personalizedInsights = insightLibrary.filter(insight => {
    const conditions = insight.conditions;
    if (!conditions) return true; // Include insights without conditions
    
    // Check all conditions using current pain data
    if (conditions.minVAS && currentPain < conditions.minVAS) return false;
    if (conditions.maxVAS && currentPain > conditions.maxVAS) return false;
    if (conditions.minPCS4 && pcs4Total < conditions.minPCS4) return false;
    if (conditions.maxPCS4 && pcs4Total > conditions.maxPCS4) return false;
    if (conditions.minFearAvoidance && fearAvoidanceScore < conditions.minFearAvoidance) return false;
    if (conditions.maxFearAvoidance && fearAvoidanceScore > conditions.maxFearAvoidance) return false;
    if (conditions.minConfidence && confidence < conditions.minConfidence) return false;
    if (conditions.maxConfidence && confidence > conditions.maxConfidence) return false;
    if (conditions.minStress && recentStress < conditions.minStress) return false;
    if (conditions.maxStress && recentStress > conditions.maxStress) return false;
    
    return true;
  });
  
  // Prioritize insights by relevance score
  const scoredInsights = personalizedInsights.map(insight => {
    let relevanceScore = 0;
    const conditions = insight.conditions;
    
    if (conditions) {
      // Higher scores for insights that closely match patient's profile (use current pain)
      if (conditions.minVAS && currentPain >= conditions.minVAS) relevanceScore += (currentPain - conditions.minVAS + 1);
      if (conditions.minPCS4 && pcs4Total >= conditions.minPCS4) relevanceScore += (pcs4Total - conditions.minPCS4 + 1);
      if (conditions.minFearAvoidance && fearAvoidanceScore >= conditions.minFearAvoidance) {
        relevanceScore += (fearAvoidanceScore - conditions.minFearAvoidance + 1);
      }
      if (conditions.maxConfidence && confidence <= conditions.maxConfidence) {
        relevanceScore += (conditions.maxConfidence - confidence + 1);
      }
    }
    
    return { ...insight, relevanceScore };
  });
  
  // Sort by relevance and return top 3-5 insights with current metrics
  const topInsights = scoredInsights
    .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
    .slice(0, 4)
    .map(({ relevanceScore, ...insight }) => ({
      ...insight,
      metrics: [
        { name: "Current Pain", value: currentPain, unit: "/10" },
        { name: "Stress Level", value: recentStress, unit: "/10" }
      ]
    }));
    
  console.log('✅ Personalized insights selected:', topInsights.map(i => ({
    id: i.id,
    title: i.title,
    category: i.category,
    conditions: i.conditions
  })));
  
  return topInsights.length > 0 ? topInsights : insightLibrary.slice(0, 3);
}

/**
 * Returns recovery insights for a patient.
 * @param {Object} patientData Patient data object
 * @param {number} refreshKey Optional key to trigger refresh
 */
export function useRecoveryInsights(patientData: any, refreshKey?: number): RecoveryInsight[] {
  const [insights, setInsights] = useState<RecoveryInsight[]>([]);
  const [completedInsights, setCompletedInsights] = useState<string[]>([]);
  
  console.log('🎯 useRecoveryInsights called with:', { patientData, refreshKey });

  // Personalize insights based on patient data
  useEffect(() => {
    const personalizedInsights = personalizeInsights(patientData);
    setInsights(personalizedInsights);
  }, [patientData, refreshKey]);

  // Fetch completed insights for the patient
  useEffect(() => {
    const fetchCompletedInsights = async () => {
      if (!patientData?.email) {
        console.log('ℹ️ No patient email available, using personalized insights');
        return;
      }

      try {
        console.log('🔄 Fetching completed insights for patient:', patientData.email);
        
        // Get patient ID first
        const patientResponse = await fetch(`/api/patients/portal-data/${patientData.email}`);
        if (!patientResponse.ok) {
          console.log('❌ Could not fetch patient data, using personalized insights');
          return;
        }
        
        const patientResult = await patientResponse.json();
        const patientId = patientResult.data.patient.id;
        
        // Get completed insights
        const completionsResponse = await fetch(`/api/v1/insights/complete?patientId=${patientId}`);
        console.log('🎯 Fetching completions for patient ID:', patientId);
        if (completionsResponse.ok) {
          const completionsResult = await completionsResponse.json();
          console.log('🎯 Completions API response:', completionsResult);
          setCompletedInsights(completionsResult.data.completedInsights || []);
          console.log('✅ Completed insights loaded:', completionsResult.data.completedInsights);
        } else {
          console.log('❌ Completions API failed:', completionsResponse.status);
        }
      } catch (error) {
        console.error('❌ Error fetching completed insights:', error);
      }
    };

    fetchCompletedInsights();
  }, [patientData?.email, refreshKey]);

  // Update insights with completion status
  useEffect(() => {
    const updatedInsights = insights.map(insight => ({
      ...insight,
      completed: completedInsights.includes(insight.id),
      viewed: completedInsights.includes(insight.id) // Mark as viewed if completed
    }));
    
    if (JSON.stringify(updatedInsights) !== JSON.stringify(insights)) {
      setInsights(updatedInsights);
    }
  }, [completedInsights]);

  return insights;
} 