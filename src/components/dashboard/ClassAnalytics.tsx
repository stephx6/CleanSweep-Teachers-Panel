import { useEffect, useState, useMemo } from "react";
import { usePlayerTotalLength } from "../../hooks/usePlayer";
import { getClassroomCodes } from "../../api/adminApi";
import Card from "../ui/Card";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClassroomCode {
  id: string;
  code: string;
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

interface ClassStats {
  code: string;
  playerCount: number;
  totalAttempts: number;
  totalCorrect: number;
  totalWrong: number;
  correctnessPercentage: number;
  biodegradableCorrect: number;
  biodegradableWrong: number;
  recyclableCorrect: number;
  recyclableWrong: number;
  residualCorrect: number;
  residualWrong: number;
  createdBy: string;
}

// ─── Color Tokens ─────────────────────────────────────────────────────────────

const COLORS = {
  correct: "#10b981", // emerald-500
  correctLight: "#34d399", // emerald-400
  correctBg: "#d1fae5", // emerald-100
  correctBorder: "#6ee7b7", // emerald-300
  wrong: "#ef4444", // red-500
  wrongLight: "#fca5a5", // red-300
  wrongBg: "#fee2e2", // red-100
  pageBg: "#f0fdf4", // green-50
  border: "#a7f3d0", // emerald-200
  textMuted: "#9ca3af", // gray-400
  textDark: "#1f2937", // gray-800
  textMid: "#4b5563", // gray-600
  chartGrid: "#ecfdf5", // emerald-50
  tooltipBorder: "#6ee7b7", // emerald-300
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcPct(correct: number, total: number) {
  return total > 0 ? parseFloat(((correct / total) * 100).toFixed(1)) : 0;
}

// ─── Pie Chart ────────────────────────────────────────────────────────────────

function ClassPieChart({ percentage }: { percentage: number }) {
  const data = [
    { name: "Correct", value: percentage },
    { name: "Wrong", value: 100 - percentage },
  ];
  const pieColors = [COLORS.correct, COLORS.wrong];

  return (
    <div className="flex flex-col items-center">
      <p
        className="text-xs font-semibold uppercase tracking-wide mb-1"
        style={{ color: COLORS.textMuted }}
      >
        Overall Correctness
      </p>
      <div className="relative w-32 h-32">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={38}
              outerRadius={52}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={pieColors[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, ""]}
              contentStyle={{
                borderRadius: "8px",
                border: `1px solid ${COLORS.tooltipBorder}`,
                fontSize: "11px",
                backgroundColor: "#fff",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-lg font-black"
            style={{ color: percentage >= 50 ? COLORS.correct : COLORS.wrong }}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <div className="flex gap-3 mt-1">
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: COLORS.correctLight }}
          />
          <span className="text-[10px]" style={{ color: COLORS.textMuted }}>
            Correct
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: COLORS.wrong }}
          />
          <span className="text-[10px]" style={{ color: COLORS.textMuted }}>
            Wrong
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function ClassBarChart({ stats }: { stats: ClassStats }) {
  const data = [
    {
      bin: "Bio",
      Correct: stats.biodegradableCorrect,
      Wrong: stats.biodegradableWrong,
    },
    {
      bin: "Recycle",
      Correct: stats.recyclableCorrect,
      Wrong: stats.recyclableWrong,
    },
    {
      bin: "Residual",
      Correct: stats.residualCorrect,
      Wrong: stats.residualWrong,
    },
  ];

  return (
    <div className="flex flex-col">
      <p
        className="text-xs font-semibold uppercase tracking-wide mb-2"
        style={{ color: COLORS.textMuted }}
      >
        Bin Breakdown
      </p>
      <ResponsiveContainer width="100%" height={140}>
        <BarChart
          data={data}
          margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
          barGap={3}
          barCategoryGap="30%"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={COLORS.chartGrid}
            vertical={false}
          />
          <XAxis
            dataKey="bin"
            tick={{ fontSize: 10, fill: COLORS.textMuted }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: COLORS.textMuted }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: `1px solid ${COLORS.tooltipBorder}`,
              fontSize: "11px",
              backgroundColor: "#fff",
            }}
            cursor={{ fill: COLORS.chartGrid }}
          />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
          />
          <Bar
            dataKey="Correct"
            fill={COLORS.correct}
            radius={[3, 3, 0, 0]}
          />
          <Bar dataKey="Wrong" fill={COLORS.wrong} radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Class Card ───────────────────────────────────────────────────────────────

function ClassCard({ stats }: { stats: ClassStats }) {
  return (
    <div
      className="rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden"
      style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}
    >
      {/* Card Header */}
      <div
        className="px-5 py-4 border-b"
        style={{
          background: `linear-gradient(to right, ${COLORS.pageBg}, #fff)`,
          borderColor: COLORS.border,
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-widest mb-0.5"
              style={{ color: COLORS.correct }}
            >
              Classroom Code
            </p>
            <h3
              className="text-xl font-black font-mono tracking-wider"
              style={{ color: COLORS.textDark }}
            >
              {stats.code}
            </h3>
            <p
              className="text-xs mt-0.5 flex items-center gap-1"
              style={{ color: COLORS.textMuted }}
            >
              <span>👤</span>
              <span>
                Teacher{" "}
                <span
                  className="font-semibold"
                  style={{ color: COLORS.textMid }}
                >
                  {stats.createdBy}
                </span>
              </span>
            </p>
          </div>

          <div
            className="flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[56px]"
            style={{ backgroundColor: COLORS.correct, color: "#fff" }}
          >
            <span className="text-2xl font-black leading-none">
              {stats.playerCount}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wide opacity-90">
              {stats.playerCount === 1 ? "Player" : "Players"}
            </span>
          </div>
        </div>

       
      </div>

      {/* Charts */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-center flex-1">
        {/* Pie */}
        <div className="flex-shrink-0">
          <ClassPieChart percentage={stats.correctnessPercentage} />
        </div>

        {/* Divider */}
        <div
          className="hidden sm:block w-px self-stretch"
          style={{ backgroundColor: COLORS.border }}
        />
        <div
          className="block sm:hidden h-px w-full"
          style={{ backgroundColor: COLORS.border }}
        />

        {/* Bar */}
        <div className="flex-1 w-full">
          <ClassBarChart stats={stats} />
        </div>
      </div>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      className="animate-pulse rounded-2xl overflow-hidden"
      style={{ backgroundColor: "#fff", border: `1px solid ${COLORS.border}` }}
    >
      <div
        className="px-5 py-4 border-b"
        style={{ backgroundColor: COLORS.pageBg, borderColor: COLORS.border }}
      >
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div
              className="h-3 w-24 rounded"
              style={{ backgroundColor: COLORS.correctBg }}
            />
            <div
              className="h-6 w-32 rounded"
              style={{ backgroundColor: COLORS.correctBg }}
            />
            <div
              className="h-3 w-28 rounded"
              style={{ backgroundColor: COLORS.chartGrid }}
            />
          </div>
          <div
            className="w-14 h-14 rounded-xl"
            style={{ backgroundColor: COLORS.correctBg }}
          />
        </div>
        <div className="flex gap-3 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div
                className="h-4 w-8 rounded"
                style={{ backgroundColor: COLORS.correctBg }}
              />
              <div
                className="h-2 w-12 rounded"
                style={{ backgroundColor: COLORS.chartGrid }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 flex gap-4">
        <div
          className="w-32 h-32 rounded-full mx-auto"
          style={{ backgroundColor: COLORS.chartGrid }}
        />
        <div
          className="flex-1 h-36 rounded-xl"
          style={{ backgroundColor: COLORS.chartGrid }}
        />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-16 col-span-full">
      <span className="text-5xl">🏫</span>
      <h3 className="text-lg font-bold mt-3" style={{ color: COLORS.textMid }}>
        No classrooms yet
      </h3>
      <p className="text-sm mt-1" style={{ color: COLORS.textMuted }}>
        Players will appear here once they join with a classroom code
      </p>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClassAnalytics() {
  const { totalPlayers, loading } = usePlayerTotalLength();
  const [classroomCodes, setClassroomCodes] = useState<ClassroomCode[]>([]);

  useEffect(() => {
    getClassroomCodes().then(setClassroomCodes);
  }, []);

  const classStats: ClassStats[] = useMemo(() => {
    if (!totalPlayers) return [];

    const map = new Map<string, ClassStats>();

    totalPlayers.forEach((p) => {
      const code = p.classroomCode ?? "No Code";

      if (!map.has(code)) {
        const meta = classroomCodes.find((c) => c.code === code);
        map.set(code, {
          code,
          playerCount: 0,
          totalAttempts: 0,
          totalCorrect: 0,
          totalWrong: 0,
          correctnessPercentage: 0,
          biodegradableCorrect: 0,
          biodegradableWrong: 0,
          recyclableCorrect: 0,
          recyclableWrong: 0,
          residualCorrect: 0,
          residualWrong: 0,
          createdBy: meta?.createdBy ?? "Unknown",
        });
      }

      const entry = map.get(code)!;
      entry.playerCount += 1;
      entry.totalAttempts += p.totalAttempts ?? 0;
      entry.totalCorrect += p.totalCorrect ?? 0;
      entry.totalWrong += p.totalWrong ?? 0;
      entry.biodegradableCorrect += p.biodegradableCorrect ?? 0;
      entry.biodegradableWrong += p.biodegradableWrong ?? 0;
      entry.recyclableCorrect += p.recyclableCorrect ?? 0;
      entry.recyclableWrong += p.recyclableWrong ?? 0;
      entry.residualCorrect += p.residualCorrect ?? 0;
      entry.residualWrong += p.residualWrong ?? 0;
    });

    map.forEach((entry) => {
      entry.correctnessPercentage = calcPct(
        entry.totalCorrect,
        entry.totalAttempts,
      );
    });

    return Array.from(map.values()).sort((a, b) =>
      a.code.localeCompare(b.code),
    );
  }, [totalPlayers, classroomCodes]);

  return (
    <Card fullWidth className="p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-2xl">🏫</span>
        <div>
          <h2
            className="text-base font-bold"
            style={{ color: COLORS.textDark }}
          >
            Class Analytics
          </h2>
          <p className="text-xs" style={{ color: COLORS.textMuted }}>
            Performance breakdown per classroom code
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => <SkeletonCard key={i} />)
        ) : classStats.length === 0 ? (
          <EmptyState />
        ) : (
          classStats.map((stats) => (
            <ClassCard key={stats.code} stats={stats} />
          ))
        )}
      </div>
    </Card>
  );
}
