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
import type { PlayerAnalyticsCardsProps } from "../../types/dashboardTypes";

// ─── Pie Chart: Overall Correctness ──────────────────────────────────────────

function OverallCorrectnessPie({ percentage }: { percentage: number }) {
  const data = [
    { name: "Correct", value: percentage },
    { name: "Wrong", value: 100 - percentage },
  ];

  const COLORS = ["#34d399", "#fca5a5"];

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${Number(value).toFixed(1)}%`, ""]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #BBF7D0",
                fontSize: "12px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className={`text-2xl font-bold ${
              percentage >= 50 ? "text-emerald-600" : "text-red-400"
            }`}
          >
            {percentage}%
          </span>
          <span className="text-[10px] text-gray-400 font-medium">correct</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
          <span className="text-xs text-gray-500">Correct</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-300 inline-block" />
          <span className="text-xs text-gray-500">Wrong</span>
        </div>
      </div>
    </div>
  );
}

// ─── Bar Chart: Bin Breakdown ─────────────────────────────────────────────────

function BinBarChart({
  biodegradableCorrect,
  biodegradableWrong,
  recyclableCorrect,
  recyclableWrong,
  residualCorrect,
  residualWrong,
}: {
  biodegradableCorrect: number;
  biodegradableWrong: number;
  recyclableCorrect: number;
  recyclableWrong: number;
  residualCorrect: number;
  residualWrong: number;
}) {
  const data = [
    {
      bin: "Biodegradable",
      Correct: biodegradableCorrect,
      Wrong: biodegradableWrong,
    },
    {
      bin: "Recyclable",
      Correct: recyclableCorrect,
      Wrong: recyclableWrong,
    },
    {
      bin: "Residual",
      Correct: residualCorrect,
      Wrong: residualWrong,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
        barCategoryGap="30%"
        barGap={4}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#f0fdf4"
          vertical={false}
        />
        <XAxis
          dataKey="bin"
          tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#9ca3af" }}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "10px",
            border: "1px solid #BBF7D0",
            fontSize: "12px",
          }}
          cursor={{ fill: "#f0fdf4" }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }}
        />
        <Bar dataKey="Correct" fill="#34d399" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Wrong" fill="#fca5a5" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function PlayerAnalyticsCards({
  analytics,
  isLoading = false,
}: PlayerAnalyticsCardsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* ── Overall Correctness Pie ── */}
      <Card isLoading={isLoading} skeletonHeight="h-56" fullWidth>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">📈</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Overall Correctness
              </h2>
              <p className="text-xs text-gray-400">
                Aggregated across all players
              </p>
            </div>
          </div>

          <OverallCorrectnessPie
            percentage={analytics?.totalCorrectnessPercentage ?? 0}
          />
        </div>
      </Card>

      {/* ── Bin Breakdown Bar Chart ── */}
      <Card isLoading={isLoading} skeletonHeight="h-72" fullWidth>
        <div className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🗑️</span>
            <div>
              <h2 className="text-base font-bold text-gray-800">
                Bin Correctness Breakdown
              </h2>
              <p className="text-xs text-gray-400">
                Correct vs Wrong per category
              </p>
            </div>
          </div>

          <BinBarChart
            biodegradableCorrect={analytics?.biodegradableCorrect ?? 0}
            biodegradableWrong={analytics?.biodegradableWrong ?? 0}
            recyclableCorrect={analytics?.recyclableCorrect ?? 0}
            recyclableWrong={analytics?.recyclableWrong ?? 0}
            residualCorrect={analytics?.residualCorrect ?? 0}
            residualWrong={analytics?.residualWrong ?? 0}
          />
        </div>
      </Card>
    </div>
  );
}
