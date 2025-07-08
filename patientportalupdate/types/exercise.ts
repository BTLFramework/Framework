export interface Exercise {
  id: string;
  region: string;
  phase: string;
  name: string;
  focus: string;
  description: string;
  duration: string;
  difficulty: string;
  instructions: string[];
  videoId: string;
  points: number;
  completed?: boolean;
} 