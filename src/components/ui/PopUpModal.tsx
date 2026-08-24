import { XMarkIcon } from "@heroicons/react/24/outline";
import type { PopUpModalProps } from "../../types/dashboardTypes";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcPct(correct: number, wrong: number) {
  const total = correct + wrong;
  return total > 0 ? Math.round((correct / total) * 100) : 0;
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${Math.min(pct, 100)}%` }}
      />
    </div>
  );
}

// ─── Bin Row ──────────────────────────────────────────────────────────────────

function BinStatRow({
  icon,
  label,
  correct,
  wrong,
  barColor,
  pctColor,
}: {
  icon: string;
  label: string;
  correct: number;
  wrong: number;
  barColor: string;
  pctColor: string;
}) {
  const total = correct + wrong;
  const pct = calcPct(correct, wrong);

  return (
    <div className="flex flex-col gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">{icon}</span>
          <span className="text-sm font-semibold text-gray-700">{label}</span>
        </div>
        <span className={`text-sm font-bold ${pctColor}`}>{pct}%</span>
      </div>
      <ProgressBar pct={pct} color={barColor} />
      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
        <span>✅ {correct} correct</span>
        <span>❌ {wrong} wrong</span>
        <span>📊 {total} total</span>
      </div>
    </div>
  );
}

// ─── Stat Chip ────────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-50 border border-gray-100 rounded-xl p-3 gap-0.5">
      <span className="text-lg font-bold text-gray-800">{value}</span>
      <span className="text-[10px] font-medium text-gray-400 text-center">
        {label}
      </span>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function PopUpModal({
  player,
  onClose,
  isOpen,
}: PopUpModalProps) {
  if (!isOpen) return null;

  const bioCorrect = player.biodegradableCorrect ?? 0;
  const bioWrong = player.biodegradableWrong ?? 0;
  const recCorrect = player.recyclableCorrect ?? 0;
  const recWrong = player.recyclableWrong ?? 0;
  const resCorrect = player.residualCorrect ?? 0;
  const resWrong = player.residualWrong ?? 0;
  const specialCorrect = player.specialWasteCorrect ?? 0;
  const specialWrong = player.specialWasteWrong ?? 0;

  const overallPct = player.accuracyPercentage ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-xl border border-[#BBF7D0] w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F0FDF4]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg">
              {player.username?.charAt(0).toUpperCase() ?? "?"}
            </div>
            <div>
              <h2 className="text-base font-bold text-[#0F172A]">
                {player.username || "Unknown"}
              </h2>
              <p className="text-xs text-gray-400">Player Profile</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* ── Quick Stats ── */}
          <div className="grid grid-cols-3 gap-2">
            <StatChip label="🪙 Envirocoins" value={player.envirocoins ?? 0} />
            <StatChip
              label="🗑️ Segregated"
              value={player.totalTrashSegregated ?? 0}
            />
            <StatChip label="🎯 Accuracy" value={`${overallPct.toFixed(2)}%`} />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <StatChip label="📊 Attempts" value={player.totalAttempts ?? 0} />
            <StatChip label="✅ Correct" value={player.totalCorrect ?? 0} />
            <StatChip label="❌ Wrong" value={player.totalWrong ?? 0} />
          </div>

          {/* ── Per-Bin Stats ── */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-1.5">
              <span>🗑️</span> Bin Performance
            </h3>
            <div className="flex flex-col gap-2">
              <BinStatRow
                icon="🟤"
                label="Biodegradable"
                correct={bioCorrect}
                wrong={bioWrong}
                barColor="bg-amber-400"
                pctColor={
                  calcPct(bioCorrect, bioWrong) >= 50
                    ? "text-emerald-600"
                    : "text-red-400"
                }
              />
              <BinStatRow
                icon="🔵"
                label="Recyclable"
                correct={recCorrect}
                wrong={recWrong}
                barColor="bg-blue-400"
                pctColor={
                  calcPct(recCorrect, recWrong) >= 50
                    ? "text-emerald-600"
                    : "text-red-400"
                }
              />
              <BinStatRow
                icon="⚫"
                label="Residual"
                correct={resCorrect}
                wrong={resWrong}
                barColor="bg-gray-500"
                pctColor={
                  calcPct(resCorrect, resWrong) >= 50
                    ? "text-emerald-600"
                    : "text-red-400"
                }
              />
              <BinStatRow
                icon="🟣"
                label="Special Waste"
                correct={specialCorrect}
                wrong={specialWrong}
                barColor="bg-purple-400"
                pctColor={
                  calcPct(specialCorrect, specialWrong) >= 50
                    ? "text-emerald-600"
                    : "text-red-400"
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
