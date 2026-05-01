import { usePlayerTotalLength } from "../../hooks/usePlayer";
import Card from "../ui/Card";

export default function StatCard() {
  const { totalPlayers, loading } = usePlayerTotalLength();

  if (loading) return <p>Nigga loading</p>;

  return (
    <>
      <Card>
        {totalPlayers.length === 0 ? (
          <p>No Players Found</p>
        ) : (
          <div>
            <h1>Total Players</h1>
            <p>{totalPlayers.length}</p>
          </div>
        )}
      </Card>
    </>
  );
}
