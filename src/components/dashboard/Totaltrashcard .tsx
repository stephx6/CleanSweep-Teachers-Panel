import Card from "../ui/Card";

import type {TotalTrashCardProps} from '../../types/dashboardTypes'

// ─── Milestone Thresholds ─────────────────────────────────────────────────────

function getMilestone(total: number) {
  if (total >= 1000)
    return {
      label: "Eco Champions! 🌍",
      color: "text-emerald-600",
      next: null,
    };
  if (total >= 500)
    return { label: "Green Heroes! 🌿", color: "text-green-500", next: 1000 };
  if (total >= 250)
    return { label: "Trash Busters! ♻️", color: "text-teal-500", next: 500 };
  if (total >= 100)
    return { label: "Getting Started! 🌱", color: "text-lime-500", next: 250 };
  return { label: "Just Beginning! 🌱", color: "text-gray-400", next: 100 };
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TotalTrashCard({
  total,
  isLoading = false,
}: TotalTrashCardProps) {
  const milestone = getMilestone(total);
  const nextTarget = milestone.next;
  const progressPct = nextTarget
    ? Math.min(Math.round((total / nextTarget) * 100), 100)
    : 100;

  return (
    <Card isLoading={isLoading} skeletonHeight="h-36" fullWidth>
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗑️</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Total Trash Segregated
              </h2>
              <p className="text-xs text-gray-400">
                Cumulative across all players
              </p>
            </div>
          </div>

          {/* Milestone badge */}
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border bg-gray-50 border-gray-100 ${milestone.color}`}
          >
            {milestone.label}
          </span>
        </div>

        {/* Big number */}
        <div className="flex items-end gap-2 mb-3">
          <span className="text-5xl font-black text-gray-800 leading-none tabular-nums">
            {total.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400 mb-1">items sorted</span>
        </div>

        {/* Progress to next milestone */}
        {nextTarget && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-400">
                Next milestone:{" "}
                <span className="font-semibold text-gray-600">
                  {nextTarget.toLocaleString()}
                </span>
              </span>
              <span className="text-xs font-bold text-emerald-600">
                {progressPct}%
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-emerald-400 transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              {(nextTarget - total).toLocaleString()} more to go!
            </p>
          </div>
        )}

        {nextTarget === null && (
          <p className="text-xs text-emerald-600 font-semibold">
            🎉 Your class has reached the top milestone!
          </p>
        )}
      </div>
    </Card>
  );
}
