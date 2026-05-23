import type { AdminNameProps } from "../types/dashboardTypes";
import { createContext } from "react";

export const AdminContext = createContext<AdminNameProps | null>(null);