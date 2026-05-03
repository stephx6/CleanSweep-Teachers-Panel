import { usePlayerTotalLength } from "../../hooks/usePlayer";
import Card from "../ui/Card";
import Button from "../ui/Button";
import Input from "../ui/InputField";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function StudentsTable() {
  const { totalPlayers, loading } = usePlayerTotalLength();
  const [searchTerm, setSearchTerm] = useState("");

  console.log(totalPlayers);

  // Filter players based on search term
  const filteredPlayers = totalPlayers?.filter(
    (player) =>
      player.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.id?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-[#F8FAFC] rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="w-20 h-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-[#0F172A] mb-1">
        No students found
      </h3>
      <p className="text-sm text-[#64748B]">
        Students will appear here once they join
      </p>
    </div>
  );

  return (
    <Card className="p-6 w-full bg-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A]">Students List</h2>
          <p className="text-sm text-[#64748B] mt-1">
            Manage enrolled students
          </p>
        </div>

        {/* Search Field */}
        <div className="w-full sm:w-64">
          <Input
            placeholder="Search by username or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            leftIcon={<MagnifyingGlassIcon className="w-4 h-4" />}
            fullWidth
          />
        </div>
      </div>

      {/* Stats Badge */}
      {!loading && filteredPlayers && filteredPlayers.length > 0 && (
        <div className="mb-4 flex justify-end">
          <div className="bg-[#F0FDF4] px-3 py-1 rounded-lg border border-[#BBF7D0]">
            <span className="text-sm font-medium text-[#16A34A]">
              Showing: {filteredPlayers.length} / {totalPlayers?.length || 0}{" "}
              students
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <LoadingSkeleton />
      ) : !filteredPlayers || filteredPlayers.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="w-full">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#BBF7D0] bg-[#F8FAFC]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Username
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    User ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#14532D]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredPlayers.map((player, key) => (
                  <tr
                    key={key}
                    className="border-b border-[#F0FDF4] hover:bg-[#F0FDF4] transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-[#0F172A]">
                      {player.username || "Unknown"}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm text-[#64748B]">
                      {player.id || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden space-y-3">
            {filteredPlayers.map((player, key) => (
              <div
                key={key}
                className="bg-[#F8FAFC] rounded-xl p-4 hover:bg-[#F0FDF4] transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-[#0F172A]">
                      {player.username || "Unknown"}
                    </p>
                    <p className="text-xs font-mono text-[#64748B] mt-1">
                      ID: {player.id || "N/A"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      {!loading && filteredPlayers && filteredPlayers.length > 0 && (
        <div className="mt-4 pt-4 border-t border-[#BBF7D0] text-center">
          <p className="text-xs text-[#64748B]">
            Showing {filteredPlayers.length} student
            {filteredPlayers.length !== 1 ? "s" : ""}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}
    </Card>
  );
}
