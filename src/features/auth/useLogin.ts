import { useState } from "react";
import { loginUser } from "./auth.service";



export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      await loginUser(email, password);
    } catch (err) {
        throw err;
      
    } finally{
        setLoading(false);
    }
  };
  return { login, loading };
};

