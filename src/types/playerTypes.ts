interface PlayerBinStats {
  correct: number;
  wrong: number;
  percentage: number;
}

export interface Player {
  id?: string;
  studentId?: string;
  studentName?: string;
  username: string;
  totalAttempts: number;
  totalCorrect: number;
  totalWrong: number;
  accuracyPercentage: number;
  totalTrashSegregated: number;
  envirocoins: number;
  pretestAccuracy : number;
  posttestAccuracy : number;
  biodegradable: PlayerBinStats;
  recyclable: PlayerBinStats;
  residual: PlayerBinStats;
  specialWaste: PlayerBinStats;
  classroomcode?: string;
  createdBy: string | null;
}