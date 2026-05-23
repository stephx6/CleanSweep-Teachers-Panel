import { useState } from "react";
import Card from "../ui/Card";
import type {
  LeaderboardProps,
  LeaderboardPlayer,
} from "../../types/dashboardTypes";

// ─── Types ────────────────────────────────────────────────────────────────────

type SortKey = "totalTrashSegregated" | "accuracyPercentage";

// ─── Rank Badge ───────────────────────────────────────────────────────────────

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1)
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-500 font-bold text-base">
        🥇
      </span>
    );
  if (rank === 2)
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-400 font-bold text-base">
        🥈
      </span>
    );
  if (rank === 3)
    return (
      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-100 text-orange-400 font-bold text-base">
        🥉
      </span>
    );
  return (
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 border border-gray-200 text-gray-400 font-semibold text-sm">
      {rank}
    </span>
  );
}

// ─── Player Row ───────────────────────────────────────────────────────────────

function PlayerRow({
  player,
  rank,
  sortKey,
}: {
  player: LeaderboardPlayer;
  rank: number;
  sortKey: SortKey;
}) {
  const isTop3 = rank <= 3;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        isTop3
          ? "bg-gradient-to-r from-[#f0fdf4] to-white border border-[#BBF7D0]"
          : "bg-gray-50 border border-gray-100 hover:border-[#BBF7D0]"
      }`}
    >
      {/* Rank */}
      <RankBadge rank={rank} />

      {/* Avatar + Username */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm shrink-0">
          {player.username.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-semibold text-gray-800 truncate">
          {player.username}
        </span>
      </div>

      {/* Primary Stat (highlighted) */}
      <div className="text-right shrink-0">
        <p
          className={`text-sm font-bold ${
            sortKey === "accuracyPercentage"
              ? player.accuracyPercentage >= 50
                ? "text-emerald-600"
                : "text-red-400"
              : "text-emerald-600"
          }`}
        >
          {sortKey === "accuracyPercentage"
            ? `${player.accuracyPercentage}%`
            : `${player.totalTrashSegregated} 🗑️`}
        </p>
        <p className="text-[10px] text-gray-400">
          {sortKey === "accuracyPercentage" ? "accuracy" : "segregated"}
        </p>
      </div>

      {/* Secondary Stat */}
      <div className="text-right shrink-0 w-16 hidden sm:block">
        <p className="text-sm font-semibold text-gray-500">
          {sortKey === "accuracyPercentage"
            ? player.totalTrashSegregated
            : `${player.accuracyPercentage}%`}
        </p>
        <p className="text-[10px] text-gray-400">
          {sortKey === "accuracyPercentage" ? "🗑️ trash" : "accuracy"}
        </p>
      </div>

      {/* Envirocoins */}
      <div className="text-right shrink-0 w-16 hidden sm:block">
        <p className="text-sm font-semibold text-yellow-500">
          {player.envirocoins ?? 0}
        </p>
        <p className="text-[10px] text-gray-400">coins</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Leaderboard({
  players,
  isLoading = false,
}: LeaderboardProps) {
  const [sortKey, setSortKey] = useState<SortKey>("totalTrashSegregated");

  const sorted = [...players]
    .filter((p) => (p.totalAttempts ?? 0) > 0) // exclude players who haven't played
    .sort((a, b) => (b[sortKey] ?? 0) - (a[sortKey] ?? 0));

  return (
    <Card isLoading={isLoading} skeletonHeight="h-96" fullWidth>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏆</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">Leaderboard</h2>
              <p className="text-xs text-gray-400">
                {sorted.length} active player{sorted.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* Sort Toggle */}
          <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setSortKey("totalTrashSegregated")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                sortKey === "totalTrashSegregated"
                  ? "bg-white text-emerald-600 shadow-sm border border-[#BBF7D0]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              🗑️ Trash
            </button>
            <button
              onClick={() => setSortKey("accuracyPercentage")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                sortKey === "accuracyPercentage"
                  ? "bg-white text-emerald-600 shadow-sm border border-[#BBF7D0]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              🎯 Accuracy
            </button>
          </div>
        </div>

        {/* Player List */}
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-300 gap-2">
            <span className="text-4xl">🗑️</span>
            <p className="text-sm font-medium">No active players yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {sorted.map((player, index) => (
              <PlayerRow
                key={player.username}
                player={player}
                rank={index + 1}
                sortKey={sortKey}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
