import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPlayerAnalyticsByClassCode } from "../api/classroomApi";
import Button from "../components/ui/Button";
import Input from "../components/ui/InputField";
import { UserPlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addStudents } from "../api/studentApi";
import DefaultLayout from "../layout/DefaultLayout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PlayerBinStats {
  correct: number;
  wrong: number;
  percentage: number;
}

interface Player {
  id?: string;
  studentId?: string;
  studentName?: string;
  username: string;
  totalAttempts: number;
  totalCorrect: number;
  totalWrong: number;
  accuracyPercentage: number;
  totalTrashSegregated: number;
  envirocoins: number;
  biodegradable: PlayerBinStats;
  recyclable: PlayerBinStats;
  residual: PlayerBinStats;
  specialWaste: PlayerBinStats;
  classroomcode?: string;
  createdBy: string | null;
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

  const fetchPlayers = async () => {
    if (!classroomId) return;

    try {
      setLoading(true);

      const data = await getPlayerAnalyticsByClassCode(classroomId);

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
      <div className="space-y-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-2">
              <span>👨‍🎓</span>
              Students
            </h1>

            <p className="text-sm text-[#64748B] mt-1">
              {players.length} student
              {players.length !== 1 ? "s" : ""} enrolled
            </p>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={handleAddStudent}
            className="whitespace-nowrap"
          >
            <UserPlusIcon className="w-4 h-4 mr-1.5" />
            Add Student
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#BBF7D0]">
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
                    {players.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16">
                          <div className="flex flex-col items-center justify-center text-gray-300 gap-3">
                            <span className="text-5xl">👨‍🎓</span>
                            <p className="text-sm font-medium text-gray-400">
                              No students yet
                            </p>
                            <p className="text-xs text-gray-300">
                              Add your first student to get started
                            </p>
                            <Button
                              variant="primary"
                              size="sm"
                              className="mt-2"
                              onClick={handleAddStudent}
                            >
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
                          className="border-b border-gray-100 hover:bg-[#F0FDF4] transition-colors"
                        >
                          {/* Student ID */}
                          <td className="py-3 px-4 font-mono text-sm text-[#64748B]">
                            {player.studentId || "—"}
                          </td>

                          {/* Student Name */}
                          <td className="py-3 px-4 font-medium text-[#0F172A]">
                            {player.studentName || "—"}
                          </td>

                          {/* IGN */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs shrink-0">
                                {player.username?.charAt(0).toUpperCase() ??
                                  "?"}
                              </div>
                              <span className="font-medium text-[#0F172A]">
                                {player.username || "Unknown"}
                              </span>
                            </div>
                          </td>

                          {/* Accuracy */}
                          <td className="py-3 px-4">
                            <AccuracyBadge
                              value={player.accuracyPercentage ?? 0}
                            />
                          </td>

                          {/* Bin Breakdown */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1.5">
                              <BinPill
                                icon="🟤"
                                label="Bio"
                                correct={player.biodegradable?.correct ?? 0}
                                wrong={player.biodegradable?.wrong ?? 0}
                                color="bg-amber-50 border-amber-200 text-amber-700"
                              />
                              <BinPill
                                icon="🔵"
                                label="Recycle"
                                correct={player.recyclable?.correct ?? 0}
                                wrong={player.recyclable?.wrong ?? 0}
                                color="bg-blue-50 border-blue-200 text-blue-700"
                              />
                              <BinPill
                                icon="⚫"
                                label="Residual"
                                correct={player.residual?.correct ?? 0}
                                wrong={player.residual?.wrong ?? 0}
                                color="bg-gray-50 border-gray-200 text-gray-600"
                              />
                              <BinPill
                                icon="🟣"
                                label="Special Waste"
                                correct={player.specialWaste?.correct ?? 0}
                                wrong={player.specialWaste?.wrong ?? 0}
                                color="bg-purple-50 border-purple-200 text-purple-700"
                              />
                            </div>
                          </td>

                          {/* Segregated */}
                          <td className="py-3 px-4 font-mono text-sm text-[#64748B]">
                            {player.totalTrashSegregated ?? 0}
                          </td>

                          {/* Coins */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">🪙</span>
                              <span className="font-semibold text-[#0F172A]">
                                {player.envirocoins || 0}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="md:hidden divide-y divide-gray-100">
                {players.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-gray-300 gap-3">
                    <span className="text-5xl">👨‍🎓</span>
                    <p className="text-sm font-medium text-gray-400">
                      No students yet
                    </p>
                    <p className="text-xs text-gray-300">
                      Add your first student to get started
                    </p>
                    <Button
                      variant="primary"
                      size="sm"
                      className="mt-2"
                      onClick={handleAddStudent}
                    >
                      <UserPlusIcon className="w-4 h-4 mr-1" />
                      Add Student
                    </Button>
                  </div>
                ) : (
                  players.map((player) => (
                    <div
                      key={player.id ?? player.studentId ?? player.username}
                      className="p-4 hover:bg-[#F0FDF4] transition-colors"
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
                            <p className="text-xs text-[#64748B]">
                              {player.studentName || "—"}
                              {player.studentId ? ` · ${player.studentId}` : ""}
                            </p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-yellow-500 text-xs">
                                🪙
                              </span>
                              <span className="text-xs text-[#64748B]">
                                {player.envirocoins || 0} coins
                              </span>
                            </div>
                          </div>
                        </div>
                        <AccuracyBadge value={player.accuracyPercentage ?? 0} />
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <BinPill
                          icon="🟤"
                          label="Bio"
                          correct={player.biodegradable?.correct ?? 0}
                          wrong={player.biodegradable?.wrong ?? 0}
                          color="bg-amber-50 border-amber-200 text-amber-700"
                        />
                        <BinPill
                          icon="🔵"
                          label="Recycle"
                          correct={player.recyclable?.correct ?? 0}
                          wrong={player.recyclable?.wrong ?? 0}
                          color="bg-blue-50 border-blue-200 text-blue-700"
                        />
                        <BinPill
                          icon="⚫"
                          label="Residual"
                          correct={player.residual?.correct ?? 0}
                          wrong={player.residual?.wrong ?? 0}
                          color="bg-gray-50 border-gray-200 text-gray-600"
                        />
                        <BinPill
                          icon="🟣"
                          label="Special Waste"
                          correct={player.specialWaste?.correct ?? 0}
                          wrong={player.specialWaste?.wrong ?? 0}
                          color="bg-purple-50 border-purple-200 text-purple-700"
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}

        {/* Add Student Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-[#0F172A]">
                  Add New Student
                </h2>

                <button
                  onClick={closeAddStudentModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-[#64748B] mb-4">
                Enter the student's name to add them to this classroom.
              </p>

              <div className="flex flex-col justify-center gap-3">
                <Input
                  placeholder="Student Name"
                  size="md"
                  fullWidth
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>

              {submitError && (
                <p className="text-xs text-red-500 mt-3">{submitError}</p>
              )}

              <div className="flex gap-2 mt-6">
                <Button
                  variant="ghost"
                  size="md"
                  fullWidth
                  onClick={closeAddStudentModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  fullWidth
                  onClick={handleSubmitAddStudent}
                  disabled={submitting}
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
