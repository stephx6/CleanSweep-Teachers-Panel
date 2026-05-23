import { useState } from "react";
import * as XLSX from "xlsx";
import Card from "../ui/Card";
import type { PlayerAnalytics } from "../../types/dashboardTypes";

interface ReportGeneratorProps {
  analytics: PlayerAnalytics | null;
  isLoading?: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimestamp() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // e.g. 2024-05-23
}

function buildSummaryRows(analytics: PlayerAnalytics) {
  return [
    ["CleanSweep — Class Summary Report", ""],
    ["Generated", new Date().toLocaleString()],
    [""],
    ["OVERALL", ""],
    ["Total Players", analytics.totalPlayers],
    ["Total Attempts", analytics.totalAttempts],
    ["Total Correct", analytics.totalCorrect],
    ["Total Wrong", analytics.totalWrong],
    ["Overall Correctness (%)", analytics.totalCorrectnessPercentage],
    ["Total Trash Segregated", analytics.totalTrashSegregated],
    [""],
    ["BIN BREAKDOWN", "Correct", "Wrong", "Total", "Correctness (%)"],
    [
      "Biodegradable",
      analytics.biodegradableCorrect,
      analytics.biodegradableWrong,
      analytics.biodegradableTotal,
      analytics.biodegradableCorrectnessPercentage,
    ],
    [
      "Recyclable",
      analytics.recyclableCorrect,
      analytics.recyclableWrong,
      analytics.recyclableTotal,
      analytics.recyclableCorrectnessPercentage,
    ],
    [
      "Residual",
      analytics.residualCorrect,
      analytics.residualWrong,
      analytics.residualTotal,
      analytics.residualCorrectnessPercentage,
    ],
  ];
}

function buildPerPlayerRows(analytics: PlayerAnalytics) {
  const headers = [
    "Username",
    "Total Attempts",
    "Total Correct",
    "Total Wrong",
    "Accuracy (%)",
    "Total Trash Segregated",
    "Envirocoins",
    "Bio Correct",
    "Bio Wrong",
    "Bio Accuracy (%)",
    "Recyclable Correct",
    "Recyclable Wrong",
    "Recyclable Accuracy (%)",
    "Residual Correct",
    "Residual Wrong",
    "Residual Accuracy (%)",
  ];

  const rows = analytics.perPlayer.map((p: any) => [
    p.username,
    p.totalAttempts,
    p.totalCorrect,
    p.totalWrong,
    p.accuracyPercentage,
    p.totalTrashSegregated,
    p.envirocoins,
    p.biodegradable.correct,
    p.biodegradable.wrong,
    p.biodegradable.percentage,
    p.recyclable.correct,
    p.recyclable.wrong,
    p.recyclable.percentage,
    p.residual.correct,
    p.residual.wrong,
    p.residual.percentage,
  ]);

  return [headers, ...rows];
}

// ─── Export Functions ─────────────────────────────────────────────────────────

function exportExcel(analytics: PlayerAnalytics) {
  const wb = XLSX.utils.book_new();

  // Sheet 1 — Summary
  const summaryData = buildSummaryRows(analytics);
  const wsSummary = XLSX.utils.aoa_to_sheet(summaryData);
  wsSummary["!cols"] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Class Summary");

  // Sheet 2 — Per Player
  const playerData = buildPerPlayerRows(analytics);
  const wsPlayers = XLSX.utils.aoa_to_sheet(playerData);
  wsPlayers["!cols"] = Array(16).fill({ wch: 20 });
  XLSX.utils.book_append_sheet(wb, wsPlayers, "Per Player");

  XLSX.writeFile(wb, `cleansweep-report-${getTimestamp()}.xlsx`);
}

function exportCSV(analytics: PlayerAnalytics) {
  // CSV: two sections separated by blank lines
  const summaryRows = buildSummaryRows(analytics);
  const playerRows = buildPerPlayerRows(analytics);

  const allRows = [
    ...summaryRows,
    [],
    ["--- PER PLAYER BREAKDOWN ---"],
    ...playerRows,
  ];

  const csvContent = allRows
    .map((row) =>
      (row as (string | number)[])
        .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
        .join(","),
    )
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `cleansweep-report-${getTimestamp()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportGenerator({
  analytics,
  isLoading = false,
}: ReportGeneratorProps) {
  const [exporting, setExporting] = useState<"excel" | "csv" | null>(null);

  async function handleExport(type: "excel" | "csv") {
    if (!analytics) return;
    setExporting(type);
    // Small delay so the button state visually updates
    await new Promise((r) => setTimeout(r, 200));
    try {
      if (type === "excel") exportExcel(analytics);
      else exportCSV(analytics);
    } finally {
      setExporting(null);
    }
  }

  const disabled = isLoading || !analytics;

  return (
    <Card isLoading={isLoading} skeletonHeight="h-28" fullWidth>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📄</span>
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Generate Report
            </h2>
            <p className="text-xs text-gray-400">
              Export class summary + per-player breakdown
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Excel */}
          <button
            onClick={() => handleExport("excel")}
            disabled={disabled || exporting === "excel"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200
              ${
                disabled
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 active:scale-[0.98]"
              }`}
          >
            {exporting === "excel" ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <span>📊</span> Export as Excel (.xlsx)
              </>
            )}
          </button>

          {/* CSV */}
          <button
            onClick={() => handleExport("csv")}
            disabled={disabled || exporting === "csv"}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200
              ${
                disabled
                  ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
                  : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 active:scale-[0.98]"
              }`}
          >
            {exporting === "csv" ? (
              <>
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                <span>📋</span> Export as CSV
              </>
            )}
          </button>
        </div>

        {/* Info note */}
        <p className="text-[10px] text-gray-400 mt-3 text-center">
          Excel export includes two sheets:{" "}
          <span className="font-semibold">Class Summary</span> &amp;{" "}
          <span className="font-semibold">Per Player</span>. CSV combines both
          in one file.
        </p>
      </div>
    </Card>
  );
}
