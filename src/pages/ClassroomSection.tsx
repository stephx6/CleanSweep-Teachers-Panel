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
  // specialWaste is not in the original type, so we make it optional
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
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
            {label}
          </p>
          <p className="text-xl font-bold text-[#0F172A]">{value}</p>
          {subtext && (
            <p className="text-xs text-[#64748B] mt-0.5">{subtext}</p>
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
    <div className={`p-4 rounded-xl border ${color} bg-white`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{icon}</span>
          <span className="text-sm font-semibold text-[#0F172A]">{label}</span>
        </div>
        <span
          className={`text-sm font-bold px-2 py-0.5 rounded-full bg-white/70 ${
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
      <div className="flex items-center gap-4 text-xs text-[#64748B]">
        <span>✅ {correct}</span>
        <span>❌ {wrong}</span>
        <span>📊 {total} total</span>
      </div>
      <div className="mt-2 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
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

  // Safely access specialWaste with fallback
  const specialWastePercentage = player.specialWaste?.percentage ?? 0;

  // Newly-added students have no username until the game assigns one
  const displayName = player.username || player.studentName || "Unclaimed";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isTop3
          ? "bg-gradient-to-r from-[#f0fdf4] to-white border border-[#BBF7D0]"
          : "bg-gray-50 border border-gray-100 hover:border-[#BBF7D0]"
      }`}
    >
      {/* Rank */}
      <div className="shrink-0 w-8 text-center">
        {rank === 1 && <span className="text-lg">🥇</span>}
        {rank === 2 && <span className="text-lg">🥈</span>}
        {rank === 3 && <span className="text-lg">🥉</span>}
        {rank > 3 && (
          <span className="text-xs font-semibold text-gray-400">#{rank}</span>
        )}
      </div>

      {/* Avatar + Username */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">
          {initial}
        </div>
        <span className="text-sm font-semibold text-gray-800 truncate">
          {displayName}
        </span>
      </div>

      {/* Accuracy */}
      <div className="text-right shrink-0 w-16">
        <p
          className={`text-sm font-bold ${
            player.accuracyPercentage >= 75
              ? "text-emerald-600"
              : player.accuracyPercentage >= 50
                ? "text-yellow-600"
                : "text-red-400"
          }`}
        >
          {(player.accuracyPercentage ?? 0).toFixed(2)}%
        </p>
        <p className="text-[10px] text-gray-400">accuracy</p>
      </div>

      {/* Trash Segregated */}
      <div className="text-right shrink-0 w-16 hidden sm:block">
        <p className="text-sm font-semibold text-gray-600">
          {player.totalTrashSegregated ?? 0}
        </p>
        <p className="text-[10px] text-gray-400">🗑️ trash</p>
      </div>

      {/* Envirocoins */}
      <div className="text-right shrink-0 w-16 hidden sm:block">
        <p className="text-sm font-semibold text-yellow-500">
          {player.envirocoins ?? 0}
        </p>
        <p className="text-[10px] text-gray-400">🪙 coins</p>
      </div>

      {/* Bin Breakdown */}
      <div className="hidden lg:flex items-center gap-1 text-[10px]">
        <span className="px-1.5 py-0.5 bg-amber-50 rounded text-amber-700">
          🟤{player.biodegradable?.percentage ?? 0}%
        </span>
        <span className="px-1.5 py-0.5 bg-blue-50 rounded text-blue-700">
          🔵{player.recyclable?.percentage ?? 0}%
        </span>
        <span className="px-1.5 py-0.5 bg-gray-50 rounded text-gray-600">
          ⚫{player.residual?.percentage ?? 0}%
        </span>
        {player.specialWaste && (
          <span className="px-1.5 py-0.5 bg-purple-50 rounded text-purple-700">
            🟣{specialWastePercentage}%
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Empty Rankings State ────────────────────────────────────────────────────

function EmptyRankings() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-300 gap-2">
      <span className="text-4xl">📚</span>
      <p className="text-sm font-medium text-gray-400">No players found</p>
      <p className="text-xs text-gray-300">
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
          <Card key={i} className="p-4">
            <div className="animate-pulse flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-5 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
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
        <Card className="p-8">
          <div className="flex flex-col items-center justify-center text-center gap-3">
            <span className="text-4xl">⚠️</span>
            <p className="text-sm font-medium text-red-500">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
            >
              <ArrowPathIcon className="w-4 h-4 mr-1" />
              Retry
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              <span>🏫</span>
              {classroomId}
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Classroom analytics and student performance
            </p>
          </div>
          <Button
            onClick={() => navigate(`/classrooms/${classroomId}/mystudents`)}
          >
            See All My Students
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<UsersIcon className="w-5 h-5" />}
            label="Total Players"
            value={analytics?.totalPlayers ?? 0}
            subtext="Enrolled students"
            color="emerald"
          />
          <StatCard
            icon={<ChartBarIcon className="w-5 h-5" />}
            label="Total Attempts"
            value={analytics?.totalAttempts ?? 0}
            subtext={`${analytics?.totalCorrect ?? 0} correct, ${
              analytics?.totalWrong ?? 0
            } wrong`}
            color="blue"
          />
          <StatCard
            icon={<TrophyIcon className="w-5 h-5" />}
            label="Overall Accuracy"
            value={`${analytics?.overallAccuracy ?? 0}%`}
            subtext={`${analytics?.totalCorrectnessPercentage ?? 0}% correctness`}
            color="purple"
          />
          <StatCard
            icon={<UserGroupIcon className="w-5 h-5" />}
            label="Trash Segregated"
            value={analytics?.totalTrashSegregated ?? 0}
            subtext="Total items sorted"
            color="yellow"
          />
        </div>

        {/* Bin Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                🗑️ Bin Performance
              </h2>
              <p className="text-xs text-[#64748B]">
                Accuracy breakdown by waste type
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <BinStatsCard
              icon="🟤"
              label="Biodegradable"
              correct={analytics?.biodegradableCorrect ?? 0}
              wrong={analytics?.biodegradableWrong ?? 0}
              percentage={analytics?.biodegradableCorrectnessPercentage ?? 0}
              color="border-amber-200 bg-amber-50/30"
            />
            <BinStatsCard
              icon="🔵"
              label="Recyclable"
              correct={analytics?.recyclableCorrect ?? 0}
              wrong={analytics?.recyclableWrong ?? 0}
              percentage={analytics?.recyclableCorrectnessPercentage ?? 0}
              color="border-blue-200 bg-blue-50/30"
            />
            <BinStatsCard
              icon="⚫"
              label="Residual"
              correct={analytics?.residualCorrect ?? 0}
              wrong={analytics?.residualWrong ?? 0}
              percentage={analytics?.residualCorrectnessPercentage ?? 0}
              color="border-gray-200 bg-gray-50/30"
            />
            <BinStatsCard
              icon="🟣"
              label="Special Waste"
              correct={analytics?.specialWasteCorrect ?? 0}
              wrong={analytics?.specialWasteWrong ?? 0}
              percentage={analytics?.specialWasteCorrectnessPercentage ?? 0}
              color="border-purple-200 bg-purple-50/30"
            />
          </div>
        </Card>

        {/* Player Leaderboard */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                👥 Player Rankings
              </h2>
              <p className="text-xs text-[#64748B]">
                {sortedPlayers.length} active player
                {sortedPlayers.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {hasPlayers ? (
            <div className="space-y-2">
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
