import type { CardProps, CardWithSkeletonProps } from "../../types/types";

export default function Card({
  children,
  className = "",
  onClick,
  isLoading = false,
  skeletonHeight = "h-32",
  skeletonWidth = "w-full",
  fullWidth = false, // New prop
}: CardWithSkeletonProps) {
  // Skeleton Component
  const Skeleton = () => (
    <div className="animate-pulse">
      <div
        className={`${skeletonHeight} ${fullWidth ? 'w-full' : skeletonWidth} bg-linear-to-r from-gray-100 via-gray-200 to-gray-100 rounded-xl`}
      >
        <div className="p-5 space-y-3">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <Skeleton />;
  }

  return (
    <div
      onClick={onClick}
      className={`bg-[#FFFFFF] rounded-2xl border border-[#BBF7D0] shadow-sm hover:shadow-md transition-all duration-200 ${onClick ? "cursor-pointer hover:scale-[1.02]" : ""} ${fullWidth ? 'w-full' : 'inline-block'} ${className}`}
    >
      {children}
    </div>
  );
}