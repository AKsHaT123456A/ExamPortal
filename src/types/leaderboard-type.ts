interface LeaderboardEntry {
  studentNo: string;
  name: string;
  calculatedTotalScore: number;
  userId: string;
}

export type Leaderboard = LeaderboardEntry[];