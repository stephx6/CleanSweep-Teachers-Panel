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
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}

export interface AdminNameProps {
  adminName: string | null;
}

export interface BinStat {
  correct: number;
  wrong: number;
  percentage: number;
}

export interface PlayerAnalytics {
  totalPlayers: number;
  totalAttempts: number;
  totalCorrect: number;
  totalWrong: number;
  overallAccuracy: number;
  totalCorrectnessPercentage: number;
  totalTrashSegregated : number
  biodegradableCorrect: number;
  biodegradableWrong: number;
  biodegradableTotal: number;
  biodegradableCorrectnessPercentage: number;
  perPlayer :LeaderboardPlayer[];
  recyclableCorrect: number;
  recyclableWrong: number;
  recyclableTotal: number;
  recyclableCorrectnessPercentage: number;

  residualCorrect: number;
  residualWrong: number;
  residualTotal: number;
  residualCorrectnessPercentage: number;
}

export interface PlayerAnalyticsCardsProps {
  analytics: PlayerAnalytics | null;
  isLoading?: boolean;
}

export interface LeaderboardPlayer {
  username: string;
  totalTrashSegregated: number;
  accuracyPercentage: number;
  envirocoins: number;
  totalAttempts: number;
}

export interface LeaderboardProps {
  players: LeaderboardPlayer[];
  isLoading?: boolean;
}

export interface Player {
  username?: string;
  envirocoins?: number;
  totalTrashSegregated?: number;
  accuracyPercentage?: number;
  totalAttempts?: number;
  totalCorrect?: number;
  totalWrong?: number;
  biodegradableCorrect?: number;
  biodegradableWrong?: number;
  recyclableCorrect?: number;
  recyclableWrong?: number;
  residualCorrect?: number;
  residualWrong?: number;
  [key: string]: unknown;
}

export interface PopUpModalProps {
  player: Player;
  onClose: () => void;
  isOpen: boolean;
}

export interface TotalTrashCardProps {
  total: number;
  isLoading?: boolean;
}