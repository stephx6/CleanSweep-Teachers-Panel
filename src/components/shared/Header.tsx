import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import { logOutUser } from "../../features/auth/auth.service";
import { Bars3Icon } from "@heroicons/react/24/outline";
import type { HeaderProps } from "../../types/types";
import { AdminContext } from "../../context/AdminContext";
import { useContext, useEffect, useState } from "react";

export default function Header({ onMenuClick }: HeaderProps) {
  const navigate = useNavigate();
  const context = useContext(AdminContext);

  const [adminName, setAdminName] = useState<string | null>(null);
  const [loading] = useState<boolean>(false);

  useEffect(() => {
    setAdminName(context?.adminName ?? "...");
    
  }, [context?.adminName]);

  const handleLogOut = async () => {
    await logOutUser();
    navigate("/");
  };

  return (
    <header className="bg-[#16A34A] shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-[#FFFFFF] hover:text-[#DCFCE7]"
        >
          <Bars3Icon className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2 lg:ml-0 ml-2">
          <div className="w-8 h-8 bg-[#FFFFFF] rounded-lg flex items-center justify-center">
            <span className="text-[#16A34A] text-sm font-bold">CS</span>
          </div>
          <span className="text-lg font-semibold text-[#FFFFFF] hidden sm:inline">
            Cleansweep
          </span>
        </div>

        <div className="flex-1 text-center lg:text-center">
          <h1 className="text-sm sm:text-base font-medium text-[#FFFFFF]">
            {loading ? "Loading..." : `Welcome back, Teacher ${adminName}`}
          </h1>
        </div>

        <Button variant="secondary" onClick={handleLogOut} size="md">
          Log Out
        </Button>
      </div>
    </header>
  );
}