import type { PopUpModalProps } from "../../types/types";
import Button from "./Button";

export default function PopUpModal({
  player,
  isOpen,
  onClose,
}: PopUpModalProps) {
  if (!isOpen || !player) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50">
      <div className="bg-white rounded-t-2xl sm:rounded-xl p-6 w-full sm:max-w-md shadow-lg">
        {/* Mobile drag indicator */}
        <div className="flex justify-center mb-4 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-[#E2E8F0]" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[#0F172A]">
            {player.username}
          </h2>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F172A] p-1"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-[#F0FDF4]">
            <span className="text-[#64748B]">Player ID</span>
            <span className="font-mono text-[#0F172A] text-xs sm:text-sm truncate max-w-[60%] text-right">
              {player.id}
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-[#F0FDF4]">
            <span className="text-[#64748B]">Trash Segregated</span>
            <span className="font-mono text-[#0F172A]">
              {player.totalTrashSegregated ?? "N/A"}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-[#64748B]">Envirocoins</span>
            <span className="font-semibold text-yellow-500">
              🪙 {player.envirocoins ?? 0}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
