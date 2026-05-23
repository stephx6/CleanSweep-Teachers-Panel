import { usePlayerTotalLength } from "../../hooks/usePlayer";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/InputField";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import PopUpModal from "../ui/PopUpModal";
import { useState } from "react";

// ─── Bin Pill ─────────────────────────────────────────────────────────────────

function BinPill({
  icon,
  label,
  correct,
  wrong,
  color,
}: {
  icon: string;
  label: string;
  correct: number;
  wrong: number;
  color: string;
}) {
  const total = correct + wrong;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div
      className={`flex flex-col items-center px-2 py-1 rounded-lg border ${color} min-w-[64px]`}
      title={`${label}: ${correct} correct, ${wrong} wrong`}
    >
      <span className="text-xs">{icon}</span>
      <span className="text-[9px] font-semibold text-gray-500 leading-tight">
        {label}
      </span>{" "}
      {/* 👈 added */}
      <span className="text-[11px] font-bold leading-tight">{pct}%</span>
      <span className="text-[9px] text-gray-400 leading-tight">
        {correct}/{total}
      </span>
    </div>
  );
}

// ─── Accuracy Badge ───────────────────────────────────────────────────────────

function AccuracyBadge({ value }: { value: number }) {
  const color =
    value >= 75
      ? "bg-emerald-100 text-emerald-700 border-emerald-200"
      : value >= 50
        ? "bg-yellow-100 text-yellow-700 border-yellow-200"
        : "bg-red-100 text-red-500 border-red-200";

  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-lg border ${color}`}>
      {value}%
    </span>
  );
}

// ─── Skeletons / Empty ────────────────────────────────────────────────────────

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-[#F8FAFC] rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg
        className="w-8 h-8 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-[#0F172A] mb-1">
      No students found
    </h3>
    <p className="text-sm text-[#64748B]">
      Students will appear here once they join
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function StudentsTable() {
  const { totalPlayers, loading } = usePlayerTotalLength();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const filteredPlayers = totalPlayers?.filter(
    (player) =>
      player.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <Card className="p-6 w-full bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Students List</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Manage enrolled students
          </p>
        </div>
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search by username or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
            fullWidth
          />
        </div>
      </div>

      {/* Stats Badge */}
      {!loading && filteredPlayers && filteredPlayers.length > 0 && (
        <div className="mb-4 flex justify-end">
          <div className="bg-[#F0FDF4] px-3 py-1 rounded-lg border border-[#BBF7D0]">
            <span className="text-sm font-medium text-[#16A34A]">
              Showing: {filteredPlayers.length} / {totalPlayers?.length || 0}{" "}
              students
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : !filteredPlayers || filteredPlayers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="w-full">
          {/* ── Desktop Table ── */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#BBF7D0] bg-[#F8FAFC]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Accuracy
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Bin Breakdown
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Total Segregated
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Envirocoins
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, key) => (
                  <tr
                    key={key}
                    className="border-b border-[#F0FDF4] hover:bg-[#F0FDF4] transition-colors"
                  >
                    {/* Username */}
                    <td className="py-3 px-4 font-medium text-[#0F172A]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                          {player.username?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        {player.username || "Unknown"}
                      </div>
                    </td>

                    {/* Accuracy */}
                    <td className="py-3 px-4">
                      <AccuracyBadge value={player.accuracyPercentage ?? 0} />
                    </td>

                    {/* Bin Breakdown */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <BinPill
                          icon="🟤"
                          label="Bio" // 👈 shortened
                          correct={player.biodegradableCorrect ?? 0}
                          wrong={player.biodegradableWrong ?? 0}
                          color="bg-amber-50 border-amber-200 text-amber-700"
                        />
                        <BinPill
                          icon="🔵"
                          label="Recycle" // 👈 shortened
                          correct={player.recyclableCorrect ?? 0}
                          wrong={player.recyclableWrong ?? 0}
                          color="bg-blue-50 border-blue-200 text-blue-700"
                        />
                        <BinPill
                          icon="⚫"
                          label="Residual"
                          correct={player.residualCorrect ?? 0}
                          wrong={player.residualWrong ?? 0}
                          color="bg-gray-50 border-gray-200 text-gray-600"
                        />
                      </div>
                    </td>

                    {/* Total Segregated */}
                    <td className="py-3 px-4 font-mono text-sm text-[#64748B]">
                      {player.totalTrashSegregated ?? "N/A"}
                    </td>

                    {/* Envirocoins */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-semibold text-[#0F172A]">
                          {player.envirocoins || 0}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedPlayer(player)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Mobile View ── */}
          <div className="md:hidden space-y-3">
            {filteredPlayers.map((player, key) => (
              <div
                key={key}
                className="bg-[#F8FAFC] rounded-xl p-4 hover:bg-[#F0FDF4] transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                      {player.username?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-[#0F172A]">
                        {player.username || "Unknown"}
                      </p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span className="text-yellow-500 text-xs">🪙</span>
                        <span className="text-xs text-[#64748B]">
                          {player.envirocoins || 0} coins
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedPlayer(player)}
                  >
                    View
                  </Button>
                </div>

                {/* Accuracy + Bins on mobile */}
                <div className="flex items-center gap-2 flex-wrap">
                  <AccuracyBadge value={player.accuracyPercentage ?? 0} />
                  <BinPill
                    icon="🟤"
                    label="Biodegradable"
                    correct={player.biodegradableCorrect ?? 0}
                    wrong={player.biodegradableWrong ?? 0}
                    color="bg-amber-50 border-amber-200 text-amber-700"
                  />
                  <BinPill
                    icon="🔵"
                    label="Recyclable"
                    correct={player.recyclableCorrect ?? 0}
                    wrong={player.recyclableWrong ?? 0}
                    color="bg-blue-50 border-blue-200 text-blue-700"
                  />
                  <BinPill
                    icon="⚫"
                    label="Residual"
                    correct={player.residualCorrect ?? 0}
                    wrong={player.residualWrong ?? 0}
                    color="bg-gray-50 border-gray-200 text-gray-600"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {selectedPlayer && (
        <PopUpModal
          player={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          isOpen={!!selectedPlayer}
        />
      )}

      {/* Footer */}
      {!loading && filteredPlayers && filteredPlayers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#BBF7D0] text-center">
          <p className="text-xs text-[#64748B]">
            Showing {filteredPlayers.length} student
            {filteredPlayers.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </Card>
  );
}
