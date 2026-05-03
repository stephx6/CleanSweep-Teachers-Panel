// Aside.tsx - With close functionality
import Button from "../ui/Button";
import {
  HomeIcon,
  UserCircleIcon,
  UsersIcon,
  XMarkIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";

import { useLocation, useNavigate } from "react-router-dom";

interface AsideProps {
  onClose?: () => void;
}

export default function Aside({ onClose }: AsideProps) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navigate = useNavigate();

  return (
    <aside className="bg-[#FFFFFF] border-r border-[#BBF7D0] w-64 h-full shadow-sm flex flex-col fixed">
      {/* Close button for mobile */}
      <div className="flex justify-end p-4 lg:hidden">
        <button onClick={onClose} className="text-[#166534]">
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <Button
              variant={isActive("/dashboard") ? "primary" : "ghost"}
              className="w-full justify-start"
              leftIcon={<HomeIcon className="w-5 h-5" />}
              onClick={() => {
                navigate("/dashboard");
              }}
            >
              Home
            </Button>
          </li>
          <li>
            <Button
              variant={isActive("/dashboard/classroom-codes") ? "primary" : "ghost"}
              className="w-full justify-start"
              leftIcon={<PencilIcon className="w-5 h-5" />}
              onClick={() => {
                navigate("/dashboard/classroom-codes");
              }}
            >
              Classroom Codes
            </Button>
          </li>

          <li>
            <Button
              variant={isActive("/dashboard/students") ? "primary" : "ghost"}
              className="w-full justify-start"
              leftIcon={<UsersIcon className="w-5 h-5" />}
              onClick={() => {
                navigate("/dashboard/students");
              }}
            >
              Student List
            </Button>
          </li>
          <li>
            <Button
              variant={isActive("/dashboard/profile") ? "primary" : "ghost"}
              className="w-full justify-start"
              leftIcon={<UserCircleIcon className="w-5 h-5" />}
              onClick={() => {
                navigate("/dashboard/profile");
              }}
            >
              Edit Profile
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
