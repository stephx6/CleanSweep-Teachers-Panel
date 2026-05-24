import { usePlayerTotalLength } from "../../hooks/usePlayer";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/InputField";
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import PopUpModal from "../ui/PopUpModal";
import { useState, useMemo } from "react";

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
      </span>
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
      {value.toFixed(2)}%
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
      Try adjusting your search or filters
    </p>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

type SortMode = "default" | "accuracy_desc" | "accuracy_asc";

export default function StudentsTable() {
  const { totalPlayers, loading } = usePlayerTotalLength();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedCode, setSelectedCode] = useState<string>("all");
  const [sortMode, setSortMode] = useState<SortMode>("default");
  const [showFilters, setShowFilters] = useState(false);

  // ── Unique classroom codes from data ──
  const classroomCodes = useMemo(() => {
    if (!totalPlayers) return [];
    const codes = totalPlayers
      .map((p) => p.classroomCode)
      .filter(Boolean) as string[];
    return ["all", ...Array.from(new Set(codes))];
  }, [totalPlayers]);

  // ── Filter + Sort ──
  const filteredPlayers = useMemo(() => {
    if (!totalPlayers) return [];

    let result = totalPlayers.filter((player) => {
      const matchesName = player.username
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCode =
        selectedCode === "all" || player.classroomCode === selectedCode;
      return matchesName && matchesCode;
    });

    if (sortMode === "accuracy_desc") {
      result = [...result].sort(
        (a, b) => (b.accuracyPercentage ?? 0) - (a.accuracyPercentage ?? 0),
      );
    } else if (sortMode === "accuracy_asc") {
      result = [...result].sort(
        (a, b) => (a.accuracyPercentage ?? 0) - (b.accuracyPercentage ?? 0),
      );
    }
    else {
        result = [...result].sort((a, b) => {
          const codeA = a.classroomCode ?? "";
          const codeB = b.classroomCode ?? "";
          return codeA.localeCompare(codeB);
        });
    }

    return result;
  }, [totalPlayers, searchTerm, selectedCode, sortMode]);

  // ── Active filter count (for badge) ──
  const activeFilters = [selectedCode !== "all", sortMode !== "default"].filter(
    Boolean,
  ).length;

  const clearFilters = () => {
    setSelectedCode("all");
    setSortMode("default");
  };

  return (
    <Card className="p-6 w-full bg-white">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Students List</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Manage enrolled students
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search — name only */}
          <div className="flex-1 sm:w-56">
            <Input
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="md"
              leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
              fullWidth
            />
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-semibold transition-all duration-200
              ${
                showFilters || activeFilters > 0
                  ? "bg-emerald-50 border-emerald-300 text-emerald-700"
                  : "bg-gray-50 border-gray-200 text-gray-500 hover:border-emerald-200 hover:text-emerald-600"
              }`}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
            {activeFilters > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFilters}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ── Filter Panel ── */}
      {showFilters && (
        <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row gap-4">
          {/* Classroom Code Filter */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              🏫 Classroom Code
            </p>
            <div className="flex flex-wrap gap-2">
              {classroomCodes.map((code) => (
                <button
                  key={code}
                  onClick={() => setSelectedCode(code)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-150
                    ${
                      selectedCode === code
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                >
                  {code === "all" ? "All Codes" : code}
                </button>
              ))}
            </div>
          </div>

          {/* Sort by Accuracy */}
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-500 mb-2">
              🎯 Sort by Accuracy
            </p>
            <div className="flex gap-2">
              {[
                { value: "default", label: "Default" },
                { value: "accuracy_desc", label: "↑ Highest" },
                { value: "accuracy_asc", label: "↓ Lowest" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortMode(opt.value as SortMode)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all duration-150
                    ${
                      sortMode === opt.value
                        ? "bg-emerald-500 text-white border-emerald-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-600"
                    }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear */}
          {activeFilters > 0 && (
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-semibold transition-colors"
              >
                <XMarkIcon className="w-3.5 h-3.5" />
                Clear filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Stats Badge ── */}
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

      {/* ── Content ── */}
      {loading ? (
        <LoadingSkeleton />
      ) : !filteredPlayers || filteredPlayers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="w-full">
          {/* Desktop Table */}
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
                    Classroom Code
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
                    <td className="py-3 px-4 font-medium text-[#0F172A]">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                          {player.username?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        {player.username || "Unknown"}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <AccuracyBadge value={player.accuracyPercentage ?? 0} />
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <BinPill
                          icon="🟤"
                          label="Bio"
                          correct={player.biodegradableCorrect ?? 0}
                          wrong={player.biodegradableWrong ?? 0}
                          color="bg-amber-50 border-amber-200 text-amber-700"
                        />
                        <BinPill
                          icon="🔵"
                          label="Recycle"
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

                    <td className="py-3 px-4 font-mono text-sm text-[#64748B]">
                      {player.totalTrashSegregated ?? "N/A"}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-semibold text-[#0F172A]">
                          {player.envirocoins || 0}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono text-xs bg-gray-100 border border-gray-200 px-2 py-1 rounded-lg text-gray-600">
                        {player.classroomCode ?? "N/A"}
                      </span>
                    </td>

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

          {/* Mobile View */}
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
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-yellow-500 text-xs">🪙</span>
                        <span className="text-xs text-[#64748B]">
                          {player.envirocoins || 0} coins
                        </span>
                        {player.classroomCode && (
                          <span className="font-mono text-[10px] bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded text-gray-500">
                            {player.classroomCode}
                          </span>
                        )}
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

                <div className="flex items-center gap-2 flex-wrap">
                  <AccuracyBadge value={player.accuracyPercentage ?? 0} />
                  <BinPill
                    icon="🟤"
                    label="Bio"
                    correct={player.biodegradableCorrect ?? 0}
                    wrong={player.biodegradableWrong ?? 0}
                    color="bg-amber-50 border-amber-200 text-amber-700"
                  />
                  <BinPill
                    icon="🔵"
                    label="Recycle"
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
            {selectedCode !== "all" && ` in class ${selectedCode}`}
          </p>
        </div>
      )}
    </Card>
  );
}
