export interface RecoveryMetric {
  label: string;
  value: string | number;
  change?: number;
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
} 