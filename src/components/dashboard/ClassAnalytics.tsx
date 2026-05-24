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
  const COLORS = ["#34d399", "#fca5a5"];

  return (
    <div className="flex flex-col items-center">
      <p className="text-xs font-semibold text-gray-400 mb-1 uppercase tracking-wide">
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
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value ?? 0).toFixed(1)}%`, ""]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #BBF7D0",
                fontSize: "11px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={`text-lg font-black ${percentage >= 50 ? "text-emerald-600" : "text-red-400"}`}
          >
            {percentage}%
          </span>
        </div>
      </div>
      <div className="flex gap-3 mt-1">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span className="text-[10px] text-gray-400">Correct</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-300 inline-block" />
          <span className="text-[10px] text-gray-400">Wrong</span>
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
      <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">
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
            stroke="#f0fdf4"
            vertical={false}
          />
          <XAxis
            dataKey="bin"
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #BBF7D0",
              fontSize: "11px",
            }}
            cursor={{ fill: "#f0fdf4" }}
          />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: "10px", paddingTop: "4px" }}
          />
          <Bar dataKey="Correct" fill="#34d399" radius={[3, 3, 0, 0]} />
          <Bar dataKey="Wrong" fill="#fca5a5" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Class Card ───────────────────────────────────────────────────────────────

function ClassCard({ stats }: { stats: ClassStats }) {
  return (
    <div className="bg-white rounded-2xl border border-[#BBF7D0] shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Card Header */}
      <div className="bg-gradient-to-r from-[#f0fdf4] to-white px-5 py-4 border-b border-[#BBF7D0]">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold text-emerald-500 uppercase tracking-widest mb-0.5">
              Classroom Code
            </p>
            <h3 className="text-xl font-black text-gray-800 font-mono tracking-wider">
              {stats.code}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
              <span>👤</span>
              <span>
                Teacher{" "}
                <span className="font-semibold text-gray-600">
                  {stats.createdBy}
                </span>
              </span>
            </p>
          </div>

          <div className="flex flex-col items-center justify-center bg-emerald-500 text-white rounded-xl px-3 py-2 min-w-[56px]">
            <span className="text-2xl font-black leading-none">
              {stats.playerCount}
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-wide opacity-90">
              {stats.playerCount === 1 ? "Player" : "Players"}
            </span>
          </div>
        </div>

        {/* Quick totals row */}
        <div className="flex gap-3 mt-3">
          {[
            { label: "Attempts", value: stats.totalAttempts },
            {
              label: "Correct",
              value: stats.totalCorrect,
              color: "text-emerald-600",
            },
            { label: "Wrong", value: stats.totalWrong, color: "text-red-400" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col">
              <span
                className={`text-sm font-bold ${item.color ?? "text-gray-700"}`}
              >
                {item.value}
              </span>
              <span className="text-[9px] text-gray-400 uppercase tracking-wide">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Charts */}
      <div className="p-4 flex flex-col sm:flex-row gap-4 items-center flex-1">
        {/* Pie */}
        <div className="flex-shrink-0">
          <ClassPieChart percentage={stats.correctnessPercentage} />
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px self-stretch bg-gray-100" />
        <div className="block sm:hidden h-px w-full bg-gray-100" />

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
    <div className="animate-pulse bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="bg-gray-50 px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-6 w-32 bg-gray-200 rounded" />
            <div className="h-3 w-28 bg-gray-100 rounded" />
          </div>
          <div className="w-14 h-14 bg-gray-200 rounded-xl" />
        </div>
        <div className="flex gap-3 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-1">
              <div className="h-4 w-8 bg-gray-200 rounded" />
              <div className="h-2 w-12 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 flex gap-4">
        <div className="w-32 h-32 bg-gray-100 rounded-full mx-auto" />
        <div className="flex-1 h-36 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="text-center py-16 col-span-full">
      <span className="text-5xl">🏫</span>
      <h3 className="text-lg font-bold text-gray-600 mt-3">
        No classrooms yet
      </h3>
      <p className="text-sm text-gray-400 mt-1">
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

  // ── Group players by classroomCode and compute stats ──
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
          <h2 className="text-base font-bold text-gray-800">Class Analytics</h2>
          <p className="text-xs text-gray-400">
            Performance breakdown per classroom code
          </p>
        </div>
      </div>

      {/* Grid of class cards */}
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
