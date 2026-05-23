import DefaultLayout from "../layout/DefaultLayout";
import StatCard from "../components/dashboard/StatsCard";
import type {
  PlayerAnalytics,
  LeaderboardPlayer,
} from "../types/dashboardTypes";
import { getPlayerAnalytics } from "../api/adminApi";
import { useEffect, useState } from "react";
import PlayerAnalyticsCards from "../components/dashboard/PlayerAnalyticsCards";
import Leaderboard from "../components/dashboard/Leaderboard";
import TotalTrashCard from "../components/dashboard/Totaltrashcard ";

export default function Dashboard() {
  const [analytics, setAnalytics] = useState<PlayerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leaderboardPlayers, setLeaderboardPlayers] = useState<
    LeaderboardPlayer[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlayerAnalytics();
      setAnalytics(data);
      setLeaderboardPlayers(data.perPlayer);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Overview of your classroom activity
          </p>
        </div>

        {/* Row 1 — Trash Milestone + Total Players (60/40) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <TotalTrashCard
              total={analytics?.totalTrashSegregated ?? 0}
              isLoading={isLoading}
            />
          </div>
          <div className="lg:col-span-2">
            <StatCard />
          </div>
        </div>

        {/* Row 2 — Analytics + Leaderboard side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PlayerAnalyticsCards analytics={analytics} isLoading={isLoading} />
          <Leaderboard players={leaderboardPlayers} isLoading={isLoading} />
        </div>
      </div>
    </DefaultLayout>
  );
}
