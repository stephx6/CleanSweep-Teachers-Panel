import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAdminName } from "../api/adminApi";
import { AdminContext } from "./AdminContext";
import { useState, useEffect } from "react";
import type { ReactChildProps } from "../types/types";

export default function AdminProvider({ children }: ReactChildProps) {
  const [adminName, setAdminName] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setAdminName(null);
        return;
      }

      const result = await getAdminName(user.uid); 
      setAdminName(result?.username ?? null);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AdminContext.Provider value={{ adminName }}>
      {children}
    </AdminContext.Provider>
  );
}
