import DefaultLayout from "../layout/DefaultLayout";
import StatCard from "../components/dashboard/StatsCard";
export default function Dashboard() {
  
 
  return (
    <>
      <DefaultLayout>
        <div>
          <h1>DASHBOARD</h1>
          <StatCard />
        </div>
      </DefaultLayout>
    </>
  );
}
