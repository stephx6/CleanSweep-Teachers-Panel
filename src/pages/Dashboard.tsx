import DefaultLayout from "../layout/DefaultLayout";
import StatCard from "../components/dashboard/StatsCard";

export default function Dashboard() {
  return (
    <DefaultLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Overview of your classroom activity
          </p>
        </div>

        {/* Stats Card */}
        <StatCard />
      </div>
    </DefaultLayout>
  );
}