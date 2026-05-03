import { usePlayerTotalLength } from "../../hooks/usePlayer";
import Card from "../ui/Card";

export default function StatCard() {
  const { totalPlayers, loading } = usePlayerTotalLength();

  if (loading) {
    return (
      <Card className="p-4">
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-20 mb-2"></div>
          <div className="h-7 bg-gray-200 rounded w-12"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      {totalPlayers.length === 0 ? (
        <div>
          <p className="text-sm font-medium text-[#64748B]">Total Players</p>
          <p className="text-2xl font-bold text-[#0F172A]">0</p>
          <p className="text-xs text-[#64748B] mt-1">No players yet</p>
        </div>
      ) : (
        <div>
          <p className="text-sm font-medium text-[#64748B]">Total Players</p>
          <p className="text-2xl font-bold text-[#16A34A]">
            {totalPlayers.length}
          </p>
          <p className="text-xs text-[#64748B] mt-1">Enrolled students</p>
        </div>
      )}
    </Card>
  );
}
