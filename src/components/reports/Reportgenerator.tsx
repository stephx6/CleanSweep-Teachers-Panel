import { useState } from "react";
import * as XLSX from "xlsx";
import Card from "../ui/Card";
import type {
  PlayerAnalytics,
  ReportPlayerRow,
} from "../../types/dashboardTypes";

interface ReportGeneratorProps {
  analytics: PlayerAnalytics | null;
  isLoading?: boolean;
}

type Cell = string | number;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTimestamp() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // e.g. 2024-05-23
}

function getPlayers(analytics: PlayerAnalytics): ReportPlayerRow[] {
  const raw = analytics.perPlayer;
  return Array.isArray(raw) ? (raw as unknown as ReportPlayerRow[]) : [];
}

// ─── Class summary sheet ──────────────────────────────────────────────────────

function buildSummaryRows(a: PlayerAnalytics): Cell[][] {
  return [
    ["CleanSweep — Class Summary Report"],
    ["Generated", new Date().toLocaleString()],
    [""],
    ["OVERALL"],
    ["Total Players", a.totalPlayers],
    ["Total Attempts", a.totalAttempts],
    ["Total Correct", a.totalCorrect],
    ["Total Wrong", a.totalWrong],
    ["Overall Correctness (%)", a.totalCorrectnessPercentage],
    ["Total Trash Segregated", a.totalTrashSegregated],
    [""],
    ["BIN BREAKDOWN", "Correct", "Wrong", "Total", "Correctness (%)"],
    [
      "Biodegradable",
      a.biodegradableCorrect,
      a.biodegradableWrong,
      a.biodegradableTotal,
      a.biodegradableCorrectnessPercentage,
    ],
    [
      "Recyclable",
      a.recyclableCorrect,
      a.recyclableWrong,
      a.recyclableTotal,
      a.recyclableCorrectnessPercentage,
    ],
    [
      "Residual",
      a.residualCorrect,
      a.residualWrong,
      a.residualTotal,
      a.residualCorrectnessPercentage,
    ],
    [
      "Special Waste",
      a.specialWasteCorrect,
      a.specialWasteWrong,
      a.specialWasteTotal,
      a.specialWasteCorrectnessPercentage,
    ],
  ];
}

// ─── Per-student sheet ────────────────────────────────────────────────────────

/**
 * One source of truth for the per-student sheet: header, column width, and how
 * to read the value. Headers and rows can't drift out of sync this way.
 */
type PlayerColumn = {
  header: string;
  width: number;
  value: (p: ReportPlayerRow) => Cell;
};

const PLAYER_COLUMNS: PlayerColumn[] = [
  { header: "Student ID", width: 16, value: (p) => p.studentId ?? "" },
  { header: "Student Name", width: 26, value: (p) => p.studentName ?? "" },
  { header: "Username", width: 20, value: (p) => p.username ?? "" },
  { header: "Classroom Code", width: 16, value: (p) => p.classroomCode ?? "" },
  { header: "Classroom", width: 22, value: (p) => p.classroomName ?? "" },
  { header: "Teacher", width: 22, value: (p) => p.createdBy ?? "" },

  {
    header: "Pretest Accuracy (%)",
    width: 20,
    value: (p) => p.pretestAccuracy ?? 0,
  },
  {
    header: "Posttest Accuracy (%)",
    width: 21,
    value: (p) => p.posttestAccuracy ?? 0,
  },

  { header: "Total Attempts", width: 15, value: (p) => p.totalAttempts ?? 0 },
  { header: "Total Correct", width: 14, value: (p) => p.totalCorrect ?? 0 },
  { header: "Total Wrong", width: 13, value: (p) => p.totalWrong ?? 0 },
  {
    header: "Accuracy (%)",
    width: 14,
    value: (p) => p.accuracyPercentage ?? 0,
  },
  {
    header: "Total Trash Segregated",
    width: 22,
    value: (p) => p.totalTrashSegregated ?? 0,
  },
  { header: "Envirocoins", width: 13, value: (p) => p.envirocoins ?? 0 },

  {
    header: "Bio Correct",
    width: 13,
    value: (p) => p.biodegradable?.correct ?? 0,
  },
  { header: "Bio Wrong", width: 12, value: (p) => p.biodegradable?.wrong ?? 0 },
  {
    header: "Bio Accuracy (%)",
    width: 17,
    value: (p) => p.biodegradable?.percentage ?? 0,
  },

  {
    header: "Recyclable Correct",
    width: 18,
    value: (p) => p.recyclable?.correct ?? 0,
  },
  {
    header: "Recyclable Wrong",
    width: 17,
    value: (p) => p.recyclable?.wrong ?? 0,
  },
  {
    header: "Recyclable Accuracy (%)",
    width: 23,
    value: (p) => p.recyclable?.percentage ?? 0,
  },

  {
    header: "Residual Correct",
    width: 16,
    value: (p) => p.residual?.correct ?? 0,
  },
  { header: "Residual Wrong", width: 15, value: (p) => p.residual?.wrong ?? 0 },
  {
    header: "Residual Accuracy (%)",
    width: 21,
    value: (p) => p.residual?.percentage ?? 0,
  },

  {
    header: "Special Waste Correct",
    width: 21,
    value: (p) => p.specialWaste?.correct ?? 0,
  },
  {
    header: "Special Waste Wrong",
    width: 20,
    value: (p) => p.specialWaste?.wrong ?? 0,
  },
  {
    header: "Special Waste Accuracy (%)",
    width: 25,
    value: (p) => p.specialWaste?.percentage ?? 0,
  },
];

function buildPerPlayerRows(analytics: PlayerAnalytics): Cell[][] {
  const players = getPlayers(analytics);
  const headers = PLAYER_COLUMNS.map((c) => c.header);

  if (players.length === 0) {
    return [
      headers,
      ["No student records were returned. Check the Firestore query."],
    ];
  }

  return [
    headers,
    ...players.map((p) => PLAYER_COLUMNS.map((c) => c.value(p))),
  ];
}

// ─── Export Functions ─────────────────────────────────────────────────────────

function exportExcel(analytics: PlayerAnalytics) {
  const wb = XLSX.utils.book_new();

  // Sheet 1 — Class Summary
  const wsSummary = XLSX.utils.aoa_to_sheet(buildSummaryRows(analytics));
  wsSummary["!cols"] = [
    { wch: 30 },
    { wch: 22 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
  ];
  XLSX.utils.book_append_sheet(wb, wsSummary, "Class Summary");

  // Sheet 2 — Per Student
  const playerRows = buildPerPlayerRows(analytics);
  const wsPlayers = XLSX.utils.aoa_to_sheet(playerRows);
  wsPlayers["!cols"] = PLAYER_COLUMNS.map((c) => ({ wch: c.width }));
  XLSX.utils.book_append_sheet(wb, wsPlayers, "Per Student");

  XLSX.writeFile(wb, `cleansweep-report-${getTimestamp()}.xlsx`);
}

function toCSV(rows: Cell[][]) {
  return rows
    .map((row) =>
      row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(","),
    )
    .join("\n");
}

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportCSV(analytics: PlayerAnalytics) {
  const rows: Cell[][] = [
    ...buildSummaryRows(analytics),
    [""],
    ["--- PER STUDENT BREAKDOWN ---"],
    ...buildPerPlayerRows(analytics),
  ];

  // Leading BOM so Excel reads the file as UTF-8
  downloadFile(
    "\uFEFF" + toCSV(rows),
    `cleansweep-report-${getTimestamp()}.csv`,
    "text/csv;charset=utf-8;",
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const SPINNER = (
  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
  </svg>
);

export default function ReportGenerator({
  analytics,
  isLoading = false,
}: ReportGeneratorProps) {
  const [exporting, setExporting] = useState<"excel" | "csv" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const studentCount = analytics ? getPlayers(analytics).length : 0;

  async function handleExport(type: "excel" | "csv") {
    if (!analytics) return;
    setExporting(type);
    setError(null);

    // Small delay so the button state visually updates
    await new Promise((r) => setTimeout(r, 200));

    try {
      console.log("[report] students in export:", studentCount, analytics.perPlayer);
      if (type === "excel") exportExcel(analytics);
      else exportCSV(analytics);
    } catch (err) {
      console.error("[report] export failed:", err);
      setError("The export didn't finish. Check the browser console for details.");
    } finally {
      setExporting(null);
    }
  }

  const disabled = isLoading || !analytics;

  const buttonClass = (tone: "emerald" | "blue") =>
    `flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-200 ${
      disabled
        ? "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
        : tone === "emerald"
          ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 active:scale-[0.98]"
          : "bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 active:scale-[0.98]"
    }`;

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
              Export class summary + per-student breakdown
            </p>
          </div>
        </div>

        {/* Row count, so an empty export is obvious before you download it */}
        {!isLoading && analytics && (
          <p
            className={`text-xs mb-3 ${
              studentCount === 0 ? "text-amber-600" : "text-gray-500"
            }`}
          >
            {studentCount === 0
              ? "No student records loaded — the export will only contain the class summary."
              : `${studentCount} student ${studentCount === 1 ? "record" : "records"} ready to export.`}
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => handleExport("excel")}
            disabled={disabled || exporting === "excel"}
            className={buttonClass("emerald")}
          >
            {exporting === "excel" ? (
              <>
                {SPINNER}
                Exporting...
              </>
            ) : (
              <>
                <span>📊</span> Export as Excel (.xlsx)
              </>
            )}
          </button>

          <button
            onClick={() => handleExport("csv")}
            disabled={disabled || exporting === "csv"}
            className={buttonClass("blue")}
          >
            {exporting === "csv" ? (
              <>
                {SPINNER}
                Exporting...
              </>
            ) : (
              <>
                <span>📋</span> Export as CSV
              </>
            )}
          </button>
        </div>

        {error && <p className="text-xs text-red-600 mt-3">{error}</p>}

        {/* Info note */}
        <p className="text-[10px] text-gray-400 mt-3 text-center">
          Excel export includes two sheets:{" "}
          <span className="font-semibold">Class Summary</span> &amp;{" "}
          <span className="font-semibold">Per Student</span>. CSV combines both
          in one file.
        </p>
      </div>
    </Card>
  );
}