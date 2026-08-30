import { useNavigate } from "react-router-dom";
import Card from "../ui/Card";

interface ClassTeacherCardProps {
  isLoading?: boolean;
  createdBy: string;
  classroomName: string;
  id: string;
}

export default function ClassTeacherCard({
  id,
  isLoading = false,
  classroomName,
  createdBy,
}: ClassTeacherCardProps) {


  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/classrooms/${id}`);
  };

  if (isLoading) {
    return (
      <Card className="p-6 h-48">
        <div className="flex flex-col justify-center h-full gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-7 bg-gray-200 rounded w-40 animate-pulse"></div>
            </div>
          </div>
          <div className="flex items-center gap-4 ml-2">
            <div className="w-14 h-14 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="flex-1">
              <div className="h-3 bg-gray-200 rounded w-16 mb-2 animate-pulse"></div>
              <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 h-48 relative" onClick={handleClick}>
      {/* Active Badge */}
      <div className="absolute top-3 right-3">
        <span className="text-[13px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-medium">
          ● Active
        </span>
      </div>

      <div className="flex flex-col justify-center h-full gap-2">
        {/* Class */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-2xl shrink-0">
            📚
          </div>
          <div>
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
              Class
            </p>
            <p className="text-2xl font-bold text-[#0F172A]">{classroomName}</p>
          </div>
        </div>

        {/* Teacher */}
        <div className="flex items-center gap-4 ml-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 text-2xl shrink-0">
            👨‍🏫
          </div>
          <div>
            <p className="text-xs font-medium text-[#64748B] uppercase tracking-wider">
              Teacher
            </p>
            <p className="text-xl font-semibold text-emerald-600">
              {createdBy}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
