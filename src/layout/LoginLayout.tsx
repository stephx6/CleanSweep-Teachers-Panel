import type { ReactChildProps } from "../types/types";

export default function LoginLayout({ children }: ReactChildProps) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        {children}
      </div>
    </>
  );
}
