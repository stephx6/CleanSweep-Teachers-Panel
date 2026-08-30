import { useState } from "react";

interface CreateClassModalProps {
  onClose: () => void;
  onSubmit: (classroomName: string) => void;
  isSubmitting?: boolean;
}

export default function CreateClassModal({
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateClassModalProps) {
  const [classroomName, setClassroomName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!classroomName.trim()) {
      setError("Classroom name is required");
      return;
    }

    onSubmit(classroomName.trim());
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏫</span>
            <h2 className="text-lg font-bold text-[#0F172A]">
              Create Classroom
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0F172A] transition-colors text-xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#64748B] mb-1">
              Classroom Name
            </label>
            <input
              type="text"
              value={classroomName}
              onChange={(e) => {
                setClassroomName(e.target.value);
                if (error) setError("");
              }}
              placeholder="e.g. Grade 10 - Mathematics"
              className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              autoFocus
              disabled={isSubmitting}
            />
          </div>

          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="text-sm px-4 py-2 rounded-lg font-medium text-[#64748B] hover:bg-gray-100 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="text-sm bg-emerald-50 text-emerald-600 px-4 py-2 rounded-lg font-medium hover:bg-emerald-100 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Classroom"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
