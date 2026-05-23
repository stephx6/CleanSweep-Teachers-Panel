import DefaultLayout from "../layout/DefaultLayout";
import ReportGenerator from "../components/reports/Reportgenerator";
import type { PlayerAnalytics } from "../types/dashboardTypes";
import { getPlayerAnalytics } from "../api/adminApi";
import { useEffect, useState } from "react";

export default function Reports() {
  const [analytics, setAnalytics] = useState<PlayerAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPlayerAnalytics();
      setAnalytics(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <DefaultLayout>
      <div className="p-6 flex flex-col gap-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]">Reports</h1>
          <p className="text-sm text-[#64748B] mt-1">
            Export your classroom data as Excel or CSV
          </p>
        </div>

        {/* Report Generator */}
        <ReportGenerator analytics={analytics} isLoading={isLoading} />
      </div>
    </DefaultLayout>
  );
}
