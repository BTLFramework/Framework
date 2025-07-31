export interface RecoveryMetric {
  name: string;
  value: number;
  unit: string;
}

export interface RecoveryInsight {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  points: number;
  metrics?: RecoveryMetric[];
  recommendations?: string[];
  viewed: boolean;
  completed: boolean;
  conditions?: {
    minVAS?: number;
    maxVAS?: number;
    minPCS4?: number;
    maxPCS4?: number;
    minFearAvoidance?: number;
    maxFearAvoidance?: number;
    minConfidence?: number;
    maxConfidence?: number;
    minStress?: number;
    maxStress?: number;
  };
} 