import type { LayoutProps } from "../types/types";

export default function LoginLayout({ children }: LayoutProps) {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        
          {children}
      
      </div>
    </>
  );
}
