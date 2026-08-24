// components/dashboard/RoomCode.tsx
import Card from "../ui/Card";
import Input from "../ui/InputField";
import Button from "../ui/Button";
import {
  createClassroomCode,
  getClassroomCodes,
  updateCodeStatus,
  deleteCode,
} from "../../api/adminApi";
import { useState, useEffect } from "react";
import type { ClassroomCode } from "../../types/dashboardTypes";
import {
  formatDate,
  filterCodes,
  copyToClipboard,
} from "../../helpers/roomCodeHelper";
import { getAuth } from "firebase/auth";

export default function RoomCode() {
  const [generatedCode, setGeneratedCode] = useState("");
  const [classroomName, setClassroomName] = useState("");
  const [nameError, setNameError] = useState("");
  const [codes, setCodes] = useState<ClassroomCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch codes on load
  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    setLoading(true);
    try {
      const fetchedCodes = await getClassroomCodes();
      setCodes(fetchedCodes);
    } catch (err) {
      console.error("Error fetching codes:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!classroomName.trim()) {
      setNameError("Classroom name is required");
      return;
    }
    setNameError("");

    try {
      const auth = getAuth();
      const uid = auth.currentUser?.uid;

      if (!uid) {
        console.error("No logged in user");
        return;
      }

      const code = await createClassroomCode(uid, classroomName.trim());
      setGeneratedCode(code);
      setClassroomName("");
      await fetchCodes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyCode = (code: string) => {
    copyToClipboard(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleDisableCode = async (id: string, currentStatus: boolean) => {
    try {
      await updateCodeStatus(id, !currentStatus);
      await fetchCodes();
    } catch (err) {
      console.error("Error updating code status:", err);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this classroom code?")
    ) {
      try {
        await deleteCode(id);
        await fetchCodes();
      } catch (err) {
        console.error("Error deleting code:", err);
      }
    }
  };

  const filteredCodes = filterCodes(codes, searchTerm, showActiveOnly);

  // Loading Skeleton
  const LoadingSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-100 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex-1 space-y-2">
                <div className="h-6 bg-gray-200 rounded w-32"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
                <div className="h-8 w-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Code Generator Section */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Generate Classroom Code
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Create new access codes for your classrooms
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-start">
          <div className="flex-1">
            <Input
              value={classroomName}
              onChange={(e) => {
                setClassroomName(e.target.value);
                if (nameError) setNameError("");
              }}
              placeholder="Classroom name (required)"
              size="md"
              fullWidth
            />
            {nameError && (
              <p className="text-xs text-red-500 mt-1">{nameError}</p>
            )}
          </div>

          <div className="flex-1 sm:w-64">
            <Input
              value={generatedCode}
              placeholder="Generated code will appear here"
              readOnly
              size="md"
              fullWidth
            />
          </div>

          <Button onClick={handleGenerate} size="md">
            Generate
          </Button>
        </div>

        {/* Latest Generated Code Highlight */}
        {generatedCode && (
          <div className="mt-4 p-3 bg-[#F0FDF4] rounded-xl border border-[#BBF7D0] flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-[#166534]">
                Latest Generated Code
              </span>
              <p className="text-lg font-bold text-[#16A34A] font-mono">
                {generatedCode}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyCode(generatedCode)}
            >
              Copy
            </Button>
          </div>
        )}
      </Card>

      {/* Classroom Codes List Section */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Classroom Codes
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Manage and monitor all active classroom codes
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:w-48">
              <Input
                placeholder="Search codes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="sm"
                fullWidth
              />
            </div>
            <Button
              variant={showActiveOnly ? "primary" : "outline"}
              size="sm"
              onClick={() => setShowActiveOnly(!showActiveOnly)}
            >
              {showActiveOnly ? "Active Only" : "All Codes"}
            </Button>
          </div>
        </div>

        {/* Codes List */}
        {loading ? (
          <LoadingSkeleton />
        ) : filteredCodes.length === 0 ? (
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-[#0F172A] mb-1">
              No codes available
            </h3>
            <p className="text-sm text-[#64748B]">
              Click "Generate" to create your first classroom code
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-150 overflow-y-auto">
            {filteredCodes.map((code) => (
              <div
                key={code.id}
                className="group bg-[#F8FAFC] hover:bg-[#F0FDF4] rounded-xl p-4 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  {/* Code Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg font-bold font-mono text-[#16A34A]">
                        {code.code}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          code.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {code.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-[#0F172A] mb-1">
                      {code.classroomName || "—"}
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#64748B]">
                      <span>Created by: {code.createdBy}</span>
                      <span>Created: {formatDate(code.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyCode(code.code)}
                    >
                      Copy
                    </Button>

                    {code.isActive ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDisableCode(code.id, code.isActive)
                        }
                        className="text-yellow-600 hover:bg-yellow-50"
                      >
                        Disable
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleDisableCode(code.id, code.isActive)
                        }
                        className="text-green-600 hover:bg-green-50"
                      >
                        Enable
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCode(code.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </Button>
                  </div>
                </div>

                {/* Copy Feedback */}
                {copiedCode === code.code && (
                  <div className="mt-2 text-xs text-green-600 animate-fade-in">
                    ✓ Copied to clipboard!
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Summary Stats */}
        {!loading && codes.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#BBF7D0] flex justify-between text-sm">
            <span className="text-[#64748B]">Total Codes: {codes.length}</span>
            <span className="text-[#16A34A]">
              Active: {codes.filter((c) => c.isActive).length}
            </span>
            <span className="text-[#EF4444]">
              Disabled: {codes.filter((c) => !c.isActive).length}
            </span>
          </div>
        )}
      </Card>
    </div>
  );
}
