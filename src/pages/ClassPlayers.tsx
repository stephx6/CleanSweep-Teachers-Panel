import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlayerAnalyticsByClassCode } from "../api/classroomApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/InputField";
import { ArrowLeftIcon, UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addStudents } from "../api/studentApi";
import DefaultLayout from "../layout/DefaultLayout";
import type { Player } from "../types/playerTypes";
// ─── Types ────────────────────────────────────────────────────────────────────




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
      className={`flex flex-col items-center px-2 py-1 rounded-lg border ${color} min-w-[52px]`}
      title={`${label}: ${correct} correct, ${wrong} wrong`}
    >
      <span className="text-xs">{icon}</span>

      <span className="text-[8px] font-semibold text-gray-500 leading-tight">
        {label}
      </span>

      <span className="text-[10px] font-bold leading-tight">{pct}%</span>

      <span className="text-[8px] text-gray-400 leading-tight">
        {correct}/{total}
      </span>
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#F8FAFC] border-b border-[#BBF7D0]">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
              Student ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
              Student Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
              IGN
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
              Accuracy
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
              Bin Breakdown
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
              Segregated
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
              Coins
            </th>
          </tr>
        </thead>

        <tbody>
          {[1, 2, 3, 4, 5].map((i) => (
            <tr key={i} className="border-b border-gray-100 animate-pulse">
              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-16" />
              </td>

              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-20" />
              </td>

              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded w-24" />
                </div>
              </td>

              <td className="py-3 px-4">
                <div className="h-6 bg-gray-200 rounded w-16" />
              </td>

              <td className="py-3 px-4">
                <div className="flex gap-1.5">
                  <div className="h-12 bg-gray-200 rounded w-14" />
                  <div className="h-12 bg-gray-200 rounded w-14" />
                  <div className="h-12 bg-gray-200 rounded w-14" />
                </div>
              </td>

              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-8" />
              </td>

              <td className="py-3 px-4">
                <div className="h-4 bg-gray-200 rounded w-12" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClassPlayers() {
  const { classroomId } = useParams();

  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [studentName, setStudentName] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchPlayers = async () => {
    if (!classroomId) return;

    try {
      setLoading(true);

      const data = await getPlayerAnalyticsByClassCode(classroomId);
      console.log(data);
      setPlayers(data.perPlayer || []);
    } catch (error) {
      console.error("Failed to fetch classroom players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId]);

  const handleAddStudent = () => {
    setShowAddModal(true);
  };

  const resetAddStudentForm = () => {
    setStudentName("");
    setSubmitError(null);
  };

  const closeAddStudentModal = () => {
    setShowAddModal(false);
    resetAddStudentForm();
  };

  const handleSubmitAddStudent = async () => {
    if (!classroomId) return;

    if (!studentName.trim()) {
      setSubmitError("Please enter a student name.");
      return;
    }

    try {
      setSubmitting(true);
      setSubmitError(null);

      await addStudents({
        studentName: studentName.trim(),
        classroomId,
      });

      closeAddStudentModal();
      await fetchPlayers();
    } catch (error) {
      console.error("Failed to add student:", error);
      setSubmitError("Failed to add student. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
   <DefaultLayout>
  <div className="space-y-6">
    {/* Return Navigation */}
    <div>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={<ArrowLeftIcon className="h-4 w-4" />}
        onClick={() => navigate(-1)}
        className="text-gray-500 hover:text-gray-900 -ml-2"
      >
        Return
      </Button>
    </div>

    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
          <span>👨‍🎓</span>
          Students
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          {players.length} student{players.length !== 1 ? "s" : ""} enrolled
        </p>
      </div>
      <Button
        variant="primary"
        size="md"
        onClick={handleAddStudent}
        className="whitespace-nowrap w-full sm:w-auto"
      >
        <UserPlusIcon className="w-4 h-4 mr-1.5" />
        Add Student
      </Button>
    </div>

    {/* Content */}
    {loading ? (
      <LoadingSkeleton />
    ) : (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-gray-200">
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Student ID</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Student Name</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">IGN</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Accuracy</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 min-w-[280px]">Bin Breakdown</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Pre-test</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Post-test</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Segregated</th>
                <th className="py-4 px-4 text-sm font-semibold text-gray-700 whitespace-nowrap">Coins</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {players.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-16">
                    <div className="flex flex-col items-center justify-center text-gray-400 gap-3">
                      <span className="text-5xl">👨‍🎓</span>
                      <p className="text-sm font-medium text-gray-500">No students yet</p>
                      <p className="text-xs text-gray-400">Add your first student to get started</p>
                      <Button variant="outline" size="sm" className="mt-2" onClick={handleAddStudent}>
                        <UserPlusIcon className="w-4 h-4 mr-1" />
                        Add Student
                      </Button>
                    </div>
                  </td>
                </tr>
              ) : (
                players.map((player) => (
                  <tr
                    key={player.id ?? player.studentId ?? player.username}
                    className="hover:bg-emerald-50/50 transition-colors"
                  >
                    <td className="py-3 px-4 font-mono text-sm text-gray-500 whitespace-nowrap">
                      {player.studentId || "—"}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900 whitespace-nowrap">
                      {player.studentName || "—"}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs shrink-0">
                          {player.username?.charAt(0).toUpperCase() ?? "?"}
                        </div>
                        <span className="font-medium text-gray-900">
                          {player.username || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <AccuracyBadge value={player.accuracyPercentage ?? 0} />
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <BinPill icon="🟤" label="Bio" correct={player.biodegradable?.correct ?? 0} wrong={player.biodegradable?.wrong ?? 0} color="bg-amber-50 border-amber-200 text-amber-700" />
                        <BinPill icon="🔵" label="Recycle" correct={player.recyclable?.correct ?? 0} wrong={player.recyclable?.wrong ?? 0} color="bg-blue-50 border-blue-200 text-blue-700" />
                        <BinPill icon="⚫" label="Residual" correct={player.residual?.correct ?? 0} wrong={player.residual?.wrong ?? 0} color="bg-gray-50 border-gray-200 text-gray-600" />
                        <BinPill icon="🟣" label="Special" correct={player.specialWaste?.correct ?? 0} wrong={player.specialWaste?.wrong ?? 0} color="bg-purple-50 border-purple-200 text-purple-700" />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-500 whitespace-nowrap">
                      {player.pretestAccuracy ?? 0}%
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-500 whitespace-nowrap">
                      {player.posttestAccuracy ?? 0}%
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-gray-500 whitespace-nowrap">
                      {player.totalTrashSegregated ?? 0}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">🪙</span>
                        <span className="font-semibold text-gray-900">{player.envirocoins || 0}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-200 bg-gray-50/50">
          {players.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-3 bg-white">
              <span className="text-5xl">👨‍🎓</span>
              <p className="text-sm font-medium text-gray-500">No students yet</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={handleAddStudent}>
                <UserPlusIcon className="w-4 h-4 mr-1" />
                Add Student
              </Button>
            </div>
          ) : (
            players.map((player) => (
              <div key={player.id ?? player.studentId ?? player.username} className="p-4 bg-white">
                
                {/* Mobile Header: User Info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm shrink-0">
                      {player.username?.charAt(0).toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{player.username || "Unknown"}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {player.studentName || "—"} {player.studentId ? `· ID: ${player.studentId}` : ""}
                      </p>
                    </div>
                  </div>
                  <AccuracyBadge value={player.accuracyPercentage ?? 0} />
                </div>

                {/* Mobile Stats Grid */}
                <div className="grid grid-cols-4 gap-2 py-3 border-y border-gray-100 mb-3 bg-gray-50/50 rounded-lg px-2">
                  <div className="text-center">
                    <span className="block text-[10px] text-gray-500 uppercase font-medium">Pre-test</span>
                    <span className="block text-sm font-mono text-gray-700 mt-0.5">{player.pretestAccuracy ?? 0}%</span>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase font-medium">Post-test</span>
                    <span className="block text-sm font-mono text-gray-700 mt-0.5">{player.posttestAccuracy ?? 0}%</span>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase font-medium">Items</span>
                    <span className="block text-sm font-mono text-gray-700 mt-0.5">{player.totalTrashSegregated ?? 0}</span>
                  </div>
                  <div className="text-center border-l border-gray-200">
                    <span className="block text-[10px] text-gray-500 uppercase font-medium">Coins</span>
                    <div className="flex items-center justify-center gap-1 mt-0.5">
                      <span className="text-yellow-500 text-xs">🪙</span>
                      <span className="text-sm font-semibold text-gray-700">{player.envirocoins || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Mobile Bins Breakdown */}
                <div className="flex flex-wrap items-center gap-2">
                  <BinPill icon="🟤" label="Bio" correct={player.biodegradable?.correct ?? 0} wrong={player.biodegradable?.wrong ?? 0} color="bg-amber-50 border-amber-200 text-amber-700" />
                  <BinPill icon="🔵" label="Recycle" correct={player.recyclable?.correct ?? 0} wrong={player.recyclable?.wrong ?? 0} color="bg-blue-50 border-blue-200 text-blue-700" />
                  <BinPill icon="⚫" label="Residual" correct={player.residual?.correct ?? 0} wrong={player.residual?.wrong ?? 0} color="bg-gray-50 border-gray-200 text-gray-600" />
                  <BinPill icon="🟣" label="Special" correct={player.specialWaste?.correct ?? 0} wrong={player.specialWaste?.wrong ?? 0} color="bg-purple-50 border-purple-200 text-purple-700" />
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    )}

    {/* Add Student Modal */}
    {showAddModal && (
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-gray-900">Add New Student</h2>
            <button
              onClick={closeAddStudentModal}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Enter the student's name to add them to this classroom.
          </p>

          <div className="space-y-2">
            <Input
              placeholder="e.g. Jane Doe"
              size="md"
              fullWidth
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              autoFocus
            />
            {submitError && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="text-xs">⚠️</span> {submitError}
              </p>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <Button
              variant="outline"
              size="md"
              className="flex-1"
              onClick={closeAddStudentModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              onClick={handleSubmitAddStudent}
              disabled={submitting || !studentName.trim()}
            >
              {submitting ? "Adding..." : "Add Student"}
            </Button>
          </div>
        </div>
      </div>
    )}
  </div>
</DefaultLayout>
  );
}
