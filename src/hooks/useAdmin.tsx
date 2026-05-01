import { useState, useEffect } from "react";
import { getAdminName } from "../api/adminApi";

export default function useAdmin() {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      const result = await getAdminName();
      setUsername(result?.username ?? null);
      setLoading(false);
      
    };
    fetchAdmin();
  }, []);
 

  return { username, loading };
}
