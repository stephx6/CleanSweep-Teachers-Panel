export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
}

export interface ClassroomCode {
  id: string;
  code: string;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
}