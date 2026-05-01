import type { LayoutProps } from "../types/types";
import Header from "../components/shared/Header";
import Aside from "../components/shared/Aside";
import { useState } from "react";


export default function DefaultLayout({ children }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F0FDF4]">
      {/* Fixed Header */}
      <Header onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)} />

      {/* Fixed Aside - Hidden on mobile by default */}
      <div
        className={`fixed inset-0 z-30 lg:hidden ${mobileMenuOpen ? "block" : "hidden"}`}
      >
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={() => setMobileMenuOpen(false)}
        />
        <div className="absolute top-0 left-0 bottom-0 w-64">
          <Aside onClose={() => setMobileMenuOpen(false)} />
        </div>
      </div>

      {/* Desktop Aside - Always visible */}
      <div className="hidden lg:block">
        <Aside />
      </div>

      {/* Main Content - Responsive margins */}
      <main className="lg:ml-64 mt-16 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
