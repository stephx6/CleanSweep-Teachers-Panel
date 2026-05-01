import DefaultLayout from "../layout/DefaultLayout";
import StatCard from "../components/dashboard/StatsCard";
import RoomCode from "../components/dashboard/RoomCode";

export default function Dashboard() {
  
 
  return (
    <>
      <DefaultLayout>
        <div>
          <h1>DASHBOARD</h1>
          <StatCard />
          <RoomCode />
        </div>
      </DefaultLayout>
    </>
  );
}
