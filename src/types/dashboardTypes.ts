export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export interface ClassroomCode {
  id: string;
  code: string;
  status: "active" | "expired" | "inactive";
  createdAt: string;
  expiresAt: string;
  students: number;
}

export interface Player {
  id: string;
  name: string;
  status: "online" | "offline" | "in-game";
  currentRoom: string;
  score: number;
  avatar?: string;
}

export interface GameEvent {
  id: string;
  player: string;
  action: string;
  score: number;
  timestamp: string;
  result?: string;
}

export interface AnalyticsData {
  mostActivePlayers: Array<{ name: string; gamesPlayed: number }>;
  averageScore: number;
  gamesPerDay: Array<{ day: string; count: number }>;
}
