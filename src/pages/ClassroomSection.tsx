import { useNavigate, useParams } from "react-router-dom";
import { getPlayerAnalyticsByClassCode } from "../api/classroomApi";
import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import {
  UsersIcon,
  TrophyIcon,
  ChartBarIcon,
  ArrowPathIcon,
  UserGroupIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import DefaultLayout from "../layout/DefaultLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerBinStats {
  correct: number;
  wrong: number;
  percentage: number;
}

interface PlayerRowData {
  studentId?: string;
  studentName?: string;
  username: string;
  totalAttempts: number;
  totalCorrect: number;
  totalWrong: number;
  accuracyPercentage: number;
  totalTrashSegregated: number;
  envirocoins: number;
  biodegradable: PlayerBinStats;
  recyclable: PlayerBinStats;
  residual: PlayerBinStats;
  classroomcode?: string;
  createdBy: string | null;
  specialWaste?: PlayerBinStats;
}

interface ClassroomAnalytics {
  totalPlayers: number;
  totalAttempts: number;
  totalCorrect: number;
  totalWrong: number;
  overallAccuracy: number;
  totalCorrectnessPercentage: number;
  totalTrashSegregated: number;
  biodegradableCorrect: number;
  biodegradableWrong: number;
  biodegradableTotal: number;
  biodegradableCorrectnessPercentage: number;
  recyclableCorrect: number;
  recyclableWrong: number;
  recyclableTotal: number;
  recyclableCorrectnessPercentage: number;
  residualCorrect: number;
  residualWrong: number;
  residualTotal: number;
  residualCorrectnessPercentage: number;
  specialWasteCorrect: number;
  specialWasteWrong: number;
  specialWasteTotal: number;
  specialWasteCorrectnessPercentage: number;
  classroomName: string;
  perPlayer: PlayerRowData[];
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  subtext,
  color = "emerald",
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: "emerald" | "blue" | "purple" | "yellow" | "gray";
}) {
  const colorClasses = {
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    yellow: "bg-yellow-50 text-yellow-600",
    gray: "bg-gray-50 text-gray-600",
  };

  return (
    <Card className="p-5 shadow-sm border border-gray-100 h-full flex flex-col justify-center">
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-0.5">
            {label}
          </p>
          <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{value}</p>
          {subtext && (
            <p className="text-xs text-gray-400 truncate">{subtext}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

// ─── Bin Stats Card ──────────────────────────────────────────────────────────

function BinStatsCard({
  icon,
  label,
  correct,
  wrong,
  percentage,
  color,
}: {
  icon: string;
  label: string;
  correct: number;
  wrong: number;
  percentage: number;
  color: string;
}) {
  const total = correct + wrong;

  return (
    <div className={`p-4 rounded-xl border ${color} bg-white shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl shrink-0">{icon}</span>
          <span className="text-sm font-bold text-gray-800 truncate">{label}</span>
        </div>
        <span
          className={`text-sm font-bold px-2.5 py-0.5 rounded-full bg-white shadow-sm border border-gray-100 ${
            percentage >= 75
              ? "text-emerald-600"
              : percentage >= 50
                ? "text-yellow-600"
                : "text-red-500"
          }`}
        >
          {percentage}%
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3 font-medium">
        <span>✅ {correct}</span>
        <span>❌ {wrong}</span>
        <span>📊 {total}</span>
      </div>
      <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage >= 75
              ? "bg-emerald-500"
              : percentage >= 50
                ? "bg-yellow-500"
                : "bg-red-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// ─── Player Row ──────────────────────────────────────────────────────────────

function PlayerRow({ player, rank }: { player: PlayerRowData; rank: number }) {
  const isTop3 = rank <= 3;
  const specialWastePercentage = player.specialWaste?.percentage ?? 0;
  const displayName = player.username || player.studentName || "Unclaimed";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 sm:gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
        isTop3
          ? "bg-gradient-to-r from-emerald-50 to-white border border-emerald-100 shadow-sm"
          : "bg-gray-50 border border-gray-100 hover:border-emerald-200"
      }`}
    >
      {/* Rank */}
      <div className="shrink-0 w-6 sm:w-8 text-center flex items-center justify-center">
        {rank === 1 && <span className="text-xl">🥇</span>}
        {rank === 2 && <span className="text-xl">🥈</span>}
        {rank === 3 && <span className="text-xl">🥉</span>}
        {rank > 3 && (
          <span className="text-xs font-bold text-gray-400">#{rank}</span>
        )}
      </div>

      {/* Avatar + Username */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
          {initial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-gray-900 truncate">
            {displayName}
          </p>
          <div className="flex lg:hidden items-center gap-2 mt-0.5 text-xs text-gray-500">
             <span>🗑️ {player.totalTrashSegregated ?? 0}</span>
             <span>🪙 {player.envirocoins ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Bin Breakdown (Desktop Only) */}
      <div className="hidden xl:flex items-center gap-1.5 text-[11px] font-medium shrink-0">
        <span className="px-2 py-1 bg-amber-50 rounded-md border border-amber-100 text-amber-700">
          🟤 {player.biodegradable?.percentage ?? 0}%
        </span>
        <span className="px-2 py-1 bg-blue-50 rounded-md border border-blue-100 text-blue-700">
          🔵 {player.recyclable?.percentage ?? 0}%
        </span>
        <span className="px-2 py-1 bg-gray-100 rounded-md border border-gray-200 text-gray-600">
          ⚫ {player.residual?.percentage ?? 0}%
        </span>
        {player.specialWaste && (
          <span className="px-2 py-1 bg-purple-50 rounded-md border border-purple-100 text-purple-700">
            🟣 {specialWastePercentage}%
          </span>
        )}
      </div>

      {/* Stats right side */}
      <div className="flex items-center gap-4 sm:gap-6 shrink-0">
        <div className="text-right hidden lg:block w-16">
          <p className="text-sm font-bold text-gray-700">
            {player.totalTrashSegregated ?? 0}
          </p>
          <p className="text-[10px] uppercase font-semibold text-gray-400">Items</p>
        </div>

        <div className="text-right hidden lg:block w-16">
          <p className="text-sm font-bold text-yellow-600 flex items-center justify-end gap-1">
            <span>🪙</span> {player.envirocoins ?? 0}
          </p>
          <p className="text-[10px] uppercase font-semibold text-gray-400">Coins</p>
        </div>

        <div className="text-right w-16 sm:w-20 bg-white px-2 py-1.5 rounded-lg border border-gray-100 shadow-sm">
          <p
            className={`text-sm sm:text-base font-bold ${
              player.accuracyPercentage >= 75
                ? "text-emerald-600"
                : player.accuracyPercentage >= 50
                  ? "text-yellow-600"
                  : "text-red-500"
            }`}
          >
            {(player.accuracyPercentage ?? 0).toFixed(1)}%
          </p>
          <p className="text-[9px] uppercase font-semibold text-gray-400 tracking-wider">Accuracy</p>
        </div>
      </div>
    </div>
  );
}

// ─── Empty Rankings State ────────────────────────────────────────────────────

function EmptyRankings() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
      <span className="text-5xl">📚</span>
      <p className="text-sm font-bold text-gray-500">No players found</p>
      <p className="text-xs text-gray-400">
        This classroom has no active players yet
      </p>
    </div>
  );
}

// ─── Loading State ───────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-5 h-24">
            <div className="animate-pulse flex items-center gap-4 h-full">
              <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-5 bg-gray-200 rounded w-40"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-28 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-3 pt-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClassroomSection() {
  const { classroomId } = useParams();
  const [analytics, setAnalytics] = useState<ClassroomAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassroomPlayers = async () => {
      if (!classroomId) return;

      try {
        setLoading(true);
        const data = await getPlayerAnalyticsByClassCode(classroomId);
        setAnalytics(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch classroom players:", err);
        setError("Failed to load classroom data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassroomPlayers();
  }, [classroomId]);

  if (loading) {
    return (
      <DefaultLayout>
        <LoadingState />
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <Card className="p-10">
          <div className="flex flex-col items-center justify-center text-center gap-4">
            <span className="text-5xl">⚠️</span>
            <p className="text-base font-medium text-red-500">{error}</p>
            <Button
              variant="outline"
              size="md"
              onClick={() => window.location.reload()}
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Retry Connection
            </Button>
          </div>
        </Card>
      </DefaultLayout>
    );
  }

  const hasPlayers = !!analytics && analytics.totalPlayers > 0;
  const sortedPlayers = analytics
    ? [...analytics.perPlayer].sort(
        (a, b) => (b.accuracyPercentage ?? 0) - (a.accuracyPercentage ?? 0),
      )
    : [];
    
  return (
    <DefaultLayout>
      <div className="space-y-6">
        
        {/* Navigation Return */}
        <div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
            onClick={() => navigate(-1)}
            className="text-gray-500 hover:text-gray-900 -ml-2"
          >
            Return
          </Button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <span>🏫</span>
              {analytics?.classroomName || "Classroom Analytics"}
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Classroom analytics and overall student performance
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate(`/classrooms/${classroomId}/mystudents`)}
            className="w-full sm:w-auto"
          >
            See All My Students
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<UsersIcon className="w-6 h-6" />}
            label="Total Players"
            value={analytics?.totalPlayers ?? 0}
            subtext="Enrolled students"
            color="emerald"
          />
          <StatCard
            icon={<ChartBarIcon className="w-6 h-6" />}
            label="Total Attempts"
            value={analytics?.totalAttempts ?? 0}
            subtext={`${analytics?.totalCorrect ?? 0} right, ${analytics?.totalWrong ?? 0} wrong`}
            color="blue"
          />
          <StatCard
            icon={<TrophyIcon className="w-6 h-6" />}
            label="Overall Accuracy"
            value={`${analytics?.overallAccuracy ?? 0}%`}
            subtext={`${analytics?.totalCorrectnessPercentage ?? 0}% correctness`}
            color="purple"
          />
          <StatCard
            icon={<UserGroupIcon className="w-6 h-6" />}
            label="Items Sorted"
            value={analytics?.totalTrashSegregated ?? 0}
            subtext="Total trash segregated"
            color="yellow"
          />
        </div>

        {/* Bin Breakdown */}
        <Card className="p-6">
          <div className="mb-5">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>🗑️</span> Bin Performance
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Overall classroom accuracy breakdown by specific waste type
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <BinStatsCard
              icon="🟤"
              label="Biodegradable"
              correct={analytics?.biodegradableCorrect ?? 0}
              wrong={analytics?.biodegradableWrong ?? 0}
              percentage={analytics?.biodegradableCorrectnessPercentage ?? 0}
              color="border-amber-200 bg-amber-50/40"
            />
            <BinStatsCard
              icon="🔵"
              label="Recyclable"
              correct={analytics?.recyclableCorrect ?? 0}
              wrong={analytics?.recyclableWrong ?? 0}
              percentage={analytics?.recyclableCorrectnessPercentage ?? 0}
              color="border-blue-200 bg-blue-50/40"
            />
            <BinStatsCard
              icon="⚫"
              label="Residual"
              correct={analytics?.residualCorrect ?? 0}
              wrong={analytics?.residualWrong ?? 0}
              percentage={analytics?.residualCorrectnessPercentage ?? 0}
              color="border-gray-200 bg-gray-50/50"
            />
            <BinStatsCard
              icon="🟣"
              label="Special Waste"
              correct={analytics?.specialWasteCorrect ?? 0}
              wrong={analytics?.specialWasteWrong ?? 0}
              percentage={analytics?.specialWasteCorrectnessPercentage ?? 0}
              color="border-purple-200 bg-purple-50/40"
            />
          </div>
        </Card>

        {/* Player Leaderboard */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <span>👥</span> Player Rankings
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {sortedPlayers.length} active player{sortedPlayers.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {hasPlayers ? (
            <div className="space-y-3">
              {sortedPlayers.map((player, index) => (
                <PlayerRow
                  key={player.studentId ?? player.username ?? index}
                  player={player}
                  rank={index + 1}
                />
              ))}
            </div>
          ) : (
            <EmptyRankings />
          )}
        </Card>
      </div>
    </DefaultLayout>
  );
}