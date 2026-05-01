import { useState, useEffect } from "react";
import { getAllPlayers } from "../api/adminApi";
export function usePlayerTotalLength (){
    const [totalPlayers, setTotalPlayers] = useState<any[]>([]);
      const [loading, setLoading] = useState(true);
      useEffect(() => {
        const fetchPlayers = async () => {
          try {
            const data = await getAllPlayers();
            setTotalPlayers(data);
          } catch (err) {
            console.error("Error Fetching Players: ", err);
          } finally {
            setLoading(false);
          }
        };
        fetchPlayers();
      }, []);
    
      return { totalPlayers , loading}
       
}