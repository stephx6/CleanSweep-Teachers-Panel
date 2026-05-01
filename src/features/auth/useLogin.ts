import { useState } from "react";
import { loginUser, getUserRole, logOutUser } from "./auth.service";

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const credential = await loginUser(email, password);
      const role = await getUserRole(credential.user.uid);

      if (role !== "admin") {
        await logOutUser();
        throw new Error("Access denied. Admins only.");
      }

      return credential;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
