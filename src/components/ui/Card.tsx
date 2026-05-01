import type { CardProps } from "../../types/types";

export default function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-[#4ADE80] inline-block rounded-2xl border p-5 border-[#BBF7D0] shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
